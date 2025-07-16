import net from 'net';
import { toUTF16BE, fix, mosStart, mos, compressed, fromUTF16BE } from '../lib/common.js';
import { MongoClient } from 'mongodb';


let serverInstance = null;

export function startMosServer() {
    if (serverInstance) {
        console.log('MOS Server already running.');
        return;
    }

    const PORT = 11540;
    const HOST = '0.0.0.0';

    serverInstance = net.createServer((socket) => {
        console.log('✅ Client connected:', socket.remoteAddress);

        socket.on('data', async (data) => {
            let xml = fromUTF16BE(data);
            console.log(xml)
            if (xml.includes("<roReqAll/>")) {
                console.log('<roReqAll/> received');
                const mos = `
                <mos>
                <ncsID>DDNRCS</ncsID>
                <mosID>WTVISION.STUDIO.MOS</mosID>
                   <roID>${process.env.MOS_DEVICE_ID}_RO</roID>
                </mos>
                `
                socket.write(toUTF16BE(compressed(mos)));

            } else if (xml.includes("<roReq>")) {
                console.log(`received: ${xml}`);

                // await new Promise((resolve) => setTimeout(resolve, 5000));

                const res = await fetch(`http://localhost:3000/api/tcp/allWtVisiononroReq`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ selectedDate: '2025-07-16', selectedRunOrderTitle: '0600 Hrs' })
                });

                const data = await res.json();
                socket.write(toUTF16BE(compressed(data.mosXml)));

                await new Promise((resolve) => setTimeout(resolve, 5000));
                // Mongo
                const mongoUri = "mongodb://localhost:27017";
                const MongoClient1 = new MongoClient(mongoUri);
                await MongoClient1.connect();
                const db1 = MongoClient1.db('slidecg');
                const collection1 = db1.collection('story_items');
                await collection1.updateMany(
                    { MosId: { $regex: '^item_' } },
                    { $set: { Color: null } }
                );
                await MongoClient1.close();
            }
            else {
                console.log(`received: ${xml}`);
            }
        });

        socket.on('end', () => console.log('❌ Client disconnected'));
        socket.on('error', (err) => console.error('⚠️ Socket error:', err));
    });

    serverInstance.listen(PORT, HOST, () => {
        console.log(`🚀 MOS TCP Server running on ${HOST}:${PORT}`);
    });
}
