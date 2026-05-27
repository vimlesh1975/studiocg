import net from "net";

let client = null;
let connectingPromise = null;

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
      console.log("MOS replied:", data.toString());
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
