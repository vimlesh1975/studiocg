import net from 'net';
import { parseString } from 'xml2js';

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

        socket.on('data', (data) => {
            let xml = data.toString();
            console.log(xml)

            // ✅ Clean unwanted characters


            // xml = xml.trim();                         // Remove leading/trailing spaces
            // xml = xml.replace(/^\u0000+/, '');        // Remove leading NULLs
            // xml = xml.replace(/\u0000+$/, '');        // Remove trailing NULLs

            // console.log('📥 Cleaned XML:\n', xml);

            // parseString(xml, (err, result) => {
            //     if (err) {
            //         console.error('❌ XML parse error:', err);
            //         return;
            //     }

            //     console.log('✅ Parsed:', result);

            //     const ack = `<?xml version="1.0" encoding="UTF-8"?><mosAck>
            //     <objID>12345</objID>
            //     <status>OK</status>
            //     </mosAck>`;


            //     socket.write(ack);
            //     console.log('📤 Sent ACK');
            // });
        });

        socket.on('end', () => console.log('❌ Client disconnected'));
        socket.on('error', (err) => console.error('⚠️ Socket error:', err));
    });

    serverInstance.listen(PORT, HOST, () => {
        console.log(`🚀 MOS TCP Server running on ${HOST}:${PORT}`);
    });
}
