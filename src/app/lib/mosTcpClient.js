import net from "net";
import { fromUTF16BE } from "./common.js";

let client = null;
let connectingPromise = null;
let latestMosMessage = null;
const mosMessageHistory = [];
const messageListeners = new Set();

const rememberMosMessage = (xml) => {
  latestMosMessage = {
    xml,
    receivedAt: new Date().toISOString(),
  };
  mosMessageHistory.push(latestMosMessage);

  if (mosMessageHistory.length > 50) {
    mosMessageHistory.shift();
  }

  for (const listener of messageListeners) {
    listener(latestMosMessage);
  }
};

export function getLatestMosMessage() {
  return latestMosMessage;
}

export function getMosMessageHistory() {
  return [...mosMessageHistory];
}

export function waitForMosMessage(filter = () => true, timeoutMs = 1500) {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      messageListeners.delete(listener);
      resolve(null);
    }, timeoutMs);

    const listener = (message) => {
      if (!filter(message)) {
        return;
      }

      clearTimeout(timer);
      messageListeners.delete(listener);
      resolve(message);
    };

    messageListeners.add(listener);
  });
}

export async function getMosTcpClient() {
  const mosServerHost = process.env.MOS_IP;
  const mosServerPort = parseInt(process.env.MOS_PORT);

  if (client && !client.destroyed && client.readyState === "open") {
    console.log("Reusing existing MOS TCP connection.");
    return client;
  }

  if (connectingPromise) {
    return connectingPromise;
  }

  connectingPromise = new Promise((resolve, reject) => {
    client = new net.Socket();
    client.setKeepAlive(true, 5000);
    client.setNoDelay(true);
    client.setTimeout(10000);

    // bind the local end to localPort (e.g. 12345)
    // client.bind(12345);

    client.connect(mosServerPort, mosServerHost, () => {
      console.log(`Connected to MOS at ${mosServerHost}:${mosServerPort}`);
      connectingPromise = null;
      resolve(client);
    });

    client.on("data", (data) => {
      const xml = fromUTF16BE(data).trim();
      rememberMosMessage(xml);
      console.log("MOS replied:", xml);
    });

    client.on("error", (err) => {
      console.error("MOS TCP connection error:", err.message);
      client.destroy();
      client = null;
      connectingPromise = null;
      reject(err);
    });

    client.on("timeout", () => {
      console.error("MOS TCP connection timed out.");
      client.destroy();
      client = null;
      connectingPromise = null;
    });

    client.on("close", () => {
      console.log("MOS TCP connection closed.");
      client = null;
      connectingPromise = null;
    });
  });

  return connectingPromise;
}
