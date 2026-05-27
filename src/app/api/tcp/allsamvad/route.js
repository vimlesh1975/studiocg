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
    const { selectedDate, selectedRunOrderTitle } = await req.json();

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

    const client = await getMosTcpClient();
    client.setNoDelay(true);

    const roID = `${process.env.MOS_DEVICE_ID}_RO`;
    const roSlug = `${selectedRunOrderTitle}_${selectedDate}`;

    let roReplace = `
  <roReplace>
    <roID>${escapeXml(roID)}</roID>
    <roSlug>${escapeXml(roSlug)}</roSlug>
    <roTrigger>MANUAL</roTrigger>
`;

    rows.forEach((story, i) => {
      const storyID = story.ScriptID || `STORY${i + 1}`;
      const storySlug = story.SlugName || `Story ${i + 1}`;
      roReplace += `    <story>
      <storyID>${escapeXml(storyID)}</storyID>
      <storySlug>${escapeXml(storySlug)}</storySlug>
      <storyNum>${i + 1}</storyNum>
    </story>
`;
    });

    roReplace += `  </roReplace>
`;

    const messagePrefix = Date.now();
    await writeMos(client, roReplace, `${messagePrefix}0`);
    await delay(sendDelayMs);

    for (let i = 0; i < rows.length; i++) {
      const story = rows[i];
      const storyID = story.ScriptID || `STORY${i + 1}`;
      const storySlug = story.SlugName || `Story ${i + 1}`;
      const storyBody = stripHtml(story.Script);

      const roStorySend = `
  <roStorySend>
    <roID>${escapeXml(roID)}</roID>
    <storyID>${escapeXml(storyID)}</storyID>
    <storySlug>${escapeXml(storySlug)}</storySlug>
    <storyNum>${i + 1}</storyNum>
    <storyBody>${escapeXml(storyBody)}</storyBody>
  </roStorySend>
`;

      await writeMos(client, roStorySend, `${messagePrefix}${i + 1}`);
      await delay(sendDelayMs);
    }

    return NextResponse.json({
      message: `Samvad updated: roReplace and ${rows.length} roStorySend messages sent for roID ${roSlug}`,
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
