import { NextResponse } from 'next/server';
import { getMosTcpClient } from '../../../lib/mosTcpClient.js';
import { toUTF16BE, mosStart, mos, compressed } from '../../../lib/common.js';
import mysql from 'mysql2/promise';
import { config } from '../../../lib/db.js';

const sendDelayMs = Number(process.env.SAMVAD_SEND_DELAY_MS || 150);

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const escapeXml = (value) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

const stripHtml = (value) => String(value ?? '')
  .replace(/<[^>]+>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const mosHeader = (messageID) => `
<mosID>${escapeXml(process.env.MOS_ID)}</mosID>
<ncsID>${escapeXml(process.env.MOS_DEVICE_ID)}</ncsID>
<messageID>${messageID}</messageID>`;

const writeMos = async (client, body, messageID) => {
  const payload = toUTF16BE(compressed(mosStart + mosHeader(messageID) + body + mos));

  await new Promise((resolve, reject) => {
    const onError = (err) => {
      client.off('drain', onDrain);
      reject(err);
    };
    const onDrain = () => {
      client.off('error', onError);
      resolve();
    };

    client.once('error', onError);

    const didFlush = client.write(payload, () => {
      client.off('error', onError);
      client.off('drain', onDrain);
      resolve();
    });

    if (!didFlush) {
      client.once('drain', onDrain);
    }
  });
};

export async function POST(req) {
  let connection;

  try {
    const {
      selectedDate,
      selectedRunOrderTitle,
      sendMode,
      currentStoryID,
      currentStoryNum,
    } = await req.json();

    connection = await mysql.createConnection(config);

    const [rows] = await connection.execute(
      `
            SELECT *
            FROM script
            WHERE deleted = 0
              AND bulletinname = ?
              AND bulletindate = ?
              ORDER BY slno
          `,
      [selectedRunOrderTitle, selectedDate]
    );

    console.log('Samvad rows fetched:', rows.length);

    if (rows.length === 0) {
      return NextResponse.json({ message: 'No rows found.' });
    }

    const stories = rows.map((story, index) => ({
      story,
      storyNum: index + 1,
    }));
    const sendBelowCurrent = sendMode === 'belowCurrent';
    const currentStoryIndex = stories.findIndex(({ story, storyNum }) => {
      if (currentStoryNum && Number(storyNum) === Number(currentStoryNum)) {
        return true;
      }

      return currentStoryID && String(story.ScriptID) === String(currentStoryID);
    });
    const storiesToSend = sendBelowCurrent
      ? stories.filter((_, index) => index > currentStoryIndex)
      : stories;

    if (sendBelowCurrent && currentStoryIndex === -1) {
      return NextResponse.json({
        message: 'Current story was not found in this run order. Nothing sent to Samvad.',
        sentCount: 0,
      });
    }

    if (storiesToSend.length === 0) {
      return NextResponse.json({
        message: sendBelowCurrent
          ? 'No stories below the current Samvad story. Nothing sent.'
          : 'No stories to send.',
        sentCount: 0,
      });
    }

    const client = await getMosTcpClient();
    client.setNoDelay(true);

    const roID = `${process.env.MOS_DEVICE_ID}_RO`;
    const roSlug = `${selectedRunOrderTitle}_${selectedDate}`;

    const messagePrefix = Date.now();

    let roReplace = `
  <roReplace>
    <roID>${escapeXml(roID)}</roID>
    <roSlug>${escapeXml(roSlug)}</roSlug>
    <roTrigger>MANUAL</roTrigger>
`;

    stories.forEach(({ story, storyNum }) => {
      const storyID = story.ScriptID || `STORY${storyNum}`;
      const storySlug = story.SlugName || `Story ${storyNum}`;
      roReplace += `    <story>
      <storyID>${escapeXml(storyID)}</storyID>
      <storySlug>${escapeXml(storySlug)}</storySlug>
      <storyNum>${storyNum}</storyNum>
    </story>
`;
    });

    roReplace += `  </roReplace>
`;

    await writeMos(client, roReplace, `${messagePrefix}0`);
    await delay(sendDelayMs);

    for (let i = 0; i < storiesToSend.length; i++) {
      const { story, storyNum } = storiesToSend[i];
      const storyID = story.ScriptID || `STORY${storyNum}`;
      const storySlug = story.SlugName || `Story ${storyNum}`;
      const storyBody = stripHtml(story.Script);

      const roStorySend = `
  <roStorySend>
    <roID>${escapeXml(roID)}</roID>
    <storyID>${escapeXml(storyID)}</storyID>
    <storySlug>${escapeXml(storySlug)}</storySlug>
    <storyNum>${storyNum}</storyNum>
    <storyBody>${escapeXml(storyBody)}</storyBody>
  </roStorySend>
`;

      await writeMos(client, roStorySend, `${messagePrefix}${i + 1}`);
      await delay(sendDelayMs);
    }

    return NextResponse.json({
      message: sendBelowCurrent
        ? `Samvad updated: roReplace and ${storiesToSend.length} stories below current story sent for roID ${roSlug}`
        : `Samvad updated: roReplace and ${storiesToSend.length} roStorySend messages sent for roID ${roSlug}`,
      sentCount: storiesToSend.length,
      mode: sendBelowCurrent ? 'belowCurrent' : 'full',
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
