import net from 'net';
import { toUTF16BE, fromUTF16BE, compressed } from './common.js';
import { MongoClient } from 'mongodb';

const serverInstances = []; // Stores server instances for all ports
const PORTS = [11540, 11541, 11542];
const HOST = '0.0.0.0';

export function startMosServer() {
    if (serverInstances.length > 0) {
        console.log('⚠️ MOS Servers already running.');
        return;
    }

    for (const PORT of PORTS) {
        const server = net.createServer((socket) => {
            console.log(`✅ Client connected on port ${PORT}:`, socket.remoteAddress);

            socket.on('data', async (data) => {
                let xml = fromUTF16BE(data).trim();
                console.log(`📥 XML from ${PORT}:\n`, xml);

                if (xml.includes('<roReqAll/>')) {
                    console.log('<roReqAll/> received');
                    const mos = `
            <mos>
              <ncsID>DDNRCS</ncsID>
              <mosID>WTVISION.STUDIO.MOS</mosID>
              <roID>${process.env.MOS_DEVICE_ID || 'MOSDEVICE'}_RO</roID>
            </mos>
          `;
                    socket.write(toUTF16BE(compressed(mos)));

                } else if (xml.includes('<roReq>')) {
                    console.log('<roReq> received');
                    try {
                        const res = await fetch('http://localhost:3000/api/tcp/allWtVisiononroReq', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                selectedDate: '2025-07-16',
                                selectedRunOrderTitle: '0600 Hrs',
                            }),
                        });

                        const { mosXml } = await res.json();
                        socket.write(toUTF16BE(compressed(mosXml)));

                        await new Promise((resolve) => setTimeout(resolve, 5000));

                        const mongoUri = 'mongodb://localhost:27017';
                        const client = new MongoClient(mongoUri);
                        await client.connect();
                        const db = client.db('slidecg');
                        await db.collection('story_items').updateMany(
                            { MosId: { $regex: '^item_' } },
                            { $set: { Color: null } }
                        );
                        await client.close();

                    } catch (error) {
                        console.error('❌ Error handling <roReq>:', error);
                    }

                } else {
                    console.log(`🟡 Unrecognized message:\n${xml}`);
                }
            });

            socket.on('end', () => console.log(`❌ Client disconnected from ${PORT}`));
            socket.on('error', (err) => console.error(`⚠️ Socket error on ${PORT}:`, err));
        });

        server.listen(PORT, HOST, () => {
            console.log(`🚀 MOS TCP Server running on ${HOST}:${PORT}`);
        });

        serverInstances.push(server);
    }
}

export function stopMosServer() {
    if (serverInstances.length === 0) {
        console.log('ℹ️ No MOS servers to stop.');
        return;
    }

    for (const server of serverInstances) {
        server.close(() => {
            console.log('🛑 MOS TCP Server closed.');
        });
    }

    serverInstances.length = 0; // Clear all instances
}
