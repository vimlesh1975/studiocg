import { NextResponse } from 'next/server';
import WebSocket from 'ws';
import { toUTF16BE, mosStart, mos, compressed } from '../../../lib/common.js';
import mysql from 'mysql2/promise';
import { config } from '../../../lib/db.js';
import {
  getLatestMosMessage,
  getMosMessageHistory,
  getMosTcpClient,
  waitForMosMessage,
} from '../../../lib/mosTcpClient.js';

const escapeXml = (value) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

const extractTag = (xml, tagName) => {
  const match = xml.match(new RegExp(`<${tagName}(?:\\s[^>]*)?>([\\s\\S]*?)</${tagName}>`, 'i'));
  return match?.[1]?.trim() || '';
};

const decodeXml = (value) => String(value || '')
  .replace(/&apos;/g, "'")
  .replace(/&quot;/g, '"')
  .replace(/&gt;/g, '>')
  .replace(/&lt;/g, '<')
  .replace(/&amp;/g, '&');

const parsePcSyncCurrentStory = (messages) => {
  const currentStoryMessage = [...messages]
    .reverse()
    .find((message) => message.xml.includes('<CurrentStoryId>'));

  if (!currentStoryMessage) {
    return null;
  }

  const readyToPlayMessage = [...messages]
    .reverse()
    .find((message) => message.xml.includes('<ReadyToPlay>'));

  const roID = decodeXml(
    extractTag(currentStoryMessage.xml, 'roID') ||
    extractTag(readyToPlayMessage?.xml || '', 'roID')
  );

  return {
    receivedAt: currentStoryMessage.receivedAt,
    roID,
    storyID: decodeXml(extractTag(currentStoryMessage.xml, 'CurrentStoryId')),
    storySlug: '',
    storyNum: '',
    itemID: '',
    status: 'CurrentStoryId',
    messageType: 'PCSyncPlay.CurrentStoryId',
    roSlug: decodeXml(extractTag(readyToPlayMessage?.xml || '', 'roSlug')),
    rawXml: currentStoryMessage.xml,
  };
};

const getCurrentStoryFromPcSync = (timeoutMs = 4000) => new Promise((resolve) => {
  const host = process.env.SAMVAD_WS_HOST || process.env.SAMVAD_WEB_HOST || '192.168.0.188';
  const port = process.env.SAMVAD_WS_PORT || '9095';
  const wsUrl = `ws://${host}:${port}`;
  const messages = [];
  const ws = new WebSocket(wsUrl, { perMessageDeflate: false, handshakeTimeout: 3000 });

  const cleanup = () => {
    clearTimeout(timer);
    ws.removeAllListeners();
    if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
      ws.close();
    }
  };

  const finish = (result) => {
    cleanup();
    resolve(result);
  };

  const timer = setTimeout(() => {
    finish({
      story: parsePcSyncCurrentStory(messages),
      messages,
      wsUrl,
    });
  }, timeoutMs);

  ws.on('open', () => {
    ws.send('ping');
  });

  ws.on('message', (data) => {
    const xml = data.toString();
    messages.push({
      xml,
      receivedAt: new Date().toISOString(),
    });

    const story = parsePcSyncCurrentStory(messages);

    if (story) {
      finish({ story, messages, wsUrl });
    }
  });

  ws.on('error', (err) => {
    finish({
      error: err.message,
      story: parsePcSyncCurrentStory(messages),
      messages,
      wsUrl,
    });
  });
});

const enrichStoryFromMysql = async (story, selectedRunOrderTitle, selectedDate) => {
  if (!story?.storyID || !selectedRunOrderTitle || !selectedDate) {
    return story;
  }

  let connection;

  try {
    connection = await mysql.createConnection(config);
    const [rows] = await connection.execute(
      `
            SELECT ScriptID, SlugName, slno
            FROM script
            WHERE deleted = 0
              AND bulletinname = ?
              AND bulletindate = ?
              AND ScriptID = ?
            LIMIT 1
          `,
      [selectedRunOrderTitle, selectedDate, story.storyID]
    );

    if (!rows.length) {
      return story;
    }

    return {
      ...story,
      storySlug: rows[0].SlugName || story.storySlug,
      storyNum: rows[0].slno || story.storyNum,
    };
  } catch (err) {
    console.error('Could not enrich Samvad story from MySQL:', err);
    return story;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

const getStatusMessageType = (xml) => {
  const match = xml.match(/<(roItemStatus|roStoryStatus|roElementStat)(?:\s|>|\/)/i);
  return match?.[1] || '';
};

const parseRoAck = (message) => {
  if (!message?.xml || !/<roAck(?:\s|>|\/)/i.test(message.xml)) {
    return null;
  }

  return {
    receivedAt: message.receivedAt,
    roID: decodeXml(extractTag(message.xml, 'roID')),
    roStatus: decodeXml(extractTag(message.xml, 'roStatus')),
    rawXml: message.xml,
  };
};

const parseMosReply = (message) => {
  if (!message?.xml) {
    return null;
  }

  const messageType = getStatusMessageType(message.xml) ||
    (/<roAck(?:\s|>|\/)/i.test(message.xml) ? 'roAck' : '') ||
    (/<heartbeat(?:\s|>|\/)/i.test(message.xml) ? 'heartbeat' : '') ||
    (/<roReqAll(?:\s|>|\/)/i.test(message.xml) ? 'roReqAll' : '') ||
    (/<roReq(?:\s|>|\/)/i.test(message.xml) ? 'roReq' : '') ||
    '';

  return {
    receivedAt: message.receivedAt,
    messageType,
    roID: decodeXml(extractTag(message.xml, 'roID')),
    roStatus: decodeXml(extractTag(message.xml, 'roStatus')),
    rawXml: message.xml,
  };
};

const writeMos = async (client, body) => {
  const messageID = Date.now();
  const payload = `
${mosStart}
  <mosID>${escapeXml(process.env.MOS_ID)}</mosID>
  <ncsID>${escapeXml(process.env.MOS_DEVICE_ID)}</ncsID>
  <messageID>${messageID}</messageID>
  ${body}
${mos}`;

  await new Promise((resolve, reject) => {
    client.write(toUTF16BE(compressed(payload)), (err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });

  return messageID;
};

const getCurrentStoryCommands = (roID) => [
  {
    name: 'roItemStatus',
    body: `
<roItemStatus>
  <roID>${escapeXml(roID)}</roID>
</roItemStatus>`,
  },
  {
    name: 'roElementStat',
    body: `
<roElementStat>
  <roID>${escapeXml(roID)}</roID>
</roElementStat>`,
  },
  {
    name: 'roReq',
    body: `
<roReq>
  <roID>${escapeXml(roID)}</roID>
</roReq>`,
  },
];

const parseStoryFromXml = (message) => {
  if (!message?.xml) {
    return null;
  }

  const { xml, receivedAt } = message;
  const messageType = getStatusMessageType(xml);

  if (!messageType) {
    return null;
  }

  const storyID = decodeXml(extractTag(xml, 'storyID'));

  if (!storyID) {
    return null;
  }

  return {
    receivedAt,
    roID: decodeXml(extractTag(xml, 'roID')),
    storyID,
    storySlug: decodeXml(extractTag(xml, 'storySlug')),
    storyNum: decodeXml(extractTag(xml, 'storyNum')),
    itemID: decodeXml(extractTag(xml, 'itemID')),
    status: decodeXml(
      extractTag(xml, 'status') ||
      extractTag(xml, 'storyStatus') ||
      extractTag(xml, 'itemStatus') ||
      extractTag(xml, 'elementStatus')
    ),
    messageType,
    rawXml: xml,
  };
};

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const roID = body.roID || `${process.env.MOS_DEVICE_ID}_RO`;
    const pcSyncResult = await getCurrentStoryFromPcSync();

    if (pcSyncResult.story) {
      const story = await enrichStoryFromMysql(
        pcSyncResult.story,
        body.selectedRunOrderTitle,
        body.selectedDate
      );

      return NextResponse.json({
        message: 'Current Samvad story read from TP WebSocket PCSyncPlay.',
        source: 'PCSyncPlay',
        wsUrl: pcSyncResult.wsUrl,
        story,
        messages: pcSyncResult.messages,
      });
    }

    const client = await getMosTcpClient();
    const replies = [];
    const requests = [];

    for (const command of getCurrentStoryCommands(roID)) {
      const waitForReply = waitForMosMessage(
        (message) => Boolean(parseStoryFromXml(message) || parseRoAck(message) || parseMosReply(message)),
        2000
      );
      const messageID = await writeMos(client, command.body);

      requests.push({ command: command.name, messageID, roID });
      console.log(`Sent Samvad ${command.name} ${messageID} for ${roID}`);

      const freshMessage = await waitForReply;
      const freshStory = parseStoryFromXml(freshMessage);

      if (freshStory) {
        return NextResponse.json({
          message: `Current Samvad story read from fresh MOS status after ${command.name}.`,
          requests,
          replies,
          story: freshStory,
        });
      }

      if (freshMessage) {
        replies.push({
          command: command.name,
          ack: parseRoAck(freshMessage),
          reply: parseMosReply(freshMessage),
        });
      }
    }

    return NextResponse.json({
      message: 'Samvad replied to MOS probe commands, but did not return current story status.',
      requests,
      replies,
      story: null,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }

  const latestStory = parseStoryFromXml(getLatestMosMessage());

  if (latestStory) {
    return NextResponse.json({
      message: 'Current Samvad story read from latest MOS status.',
      story: latestStory,
    });
  }

  const historyStory = [...getMosMessageHistory()]
    .reverse()
    .map(parseStoryFromXml)
    .find(Boolean);

  if (historyStory) {
    return NextResponse.json({
      message: 'Current Samvad story read from recent MOS status history.',
      story: historyStory,
    });
  }

  return NextResponse.json({
    message: 'No Samvad roItemStatus, roStoryStatus, or roElementStat received yet. Start/connect MOS and change the current story in Samvad, then try again.',
    story: null,
  });
}

export const GET = POST;
