import net from 'net';
import { parseString } from 'xml2js';
import { toUTF16BE, fix, mosStart, mos, compressed, fromUTF16BE } from '../lib/common.js';


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
            let xml = fromUTF16BE(data);
            console.log(xml)
            if (xml.includes("<roReqAll/>")) {
                console.log('<roReqAll/> received');
                const mos = `
                <mos>
  <ncsID>DDNRCS</ncsID>
  <mosID>WTVISION.STUDIO.MOS</mosID>
  <roElementAction operation="INSERT">
    <roID>RO001</roID>
    <element_target>
      <storyID/>
    </element_target>
    <element_source>
      <story>
        <storyID>202507031007311</storyID>
        <storySlug>slug</storySlug>
        <item>
          <itemID>hhh</itemID>
          <objID>DD_TESTING,08bbb87d-c40e-409f-be92-06d538327548</objID>
          <mosID>SAMVAD</mosID>
          <itemType>GraphicPage</itemType>
          <Thumbnail>iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wD/AP+</Thumbnail>
        
          <metadata>
            <graphicID>DD_TESTING,08bbb87d-c40e-409f-be92-06d538327548</graphicID>
            <categoryColor>Green</categoryColor>
            <tags>
              <tag tN="tHeaderA" tT="2">मौसम ने ली करवट</tag>
              <tag tN="tHeaderB" tT="2">मौसम के कारण देश मे बाढ़ की स्तिथि</tag>
              <tag tN="vWindows" tT="Float">6</tag>
              <tag tN="tTextA01" tT="2">मौसम ने ली करवट 01</tag>
              <tag tN="tTextB01" tT="2">मौसम ने ली करवट 11</tag>
            </tags>
   <color>Green</color>
  <outputChannel>Channel 1</outputChannel>
          <autoUpdate>true</autoUpdate>
          </metadata>
        </item>
      </story>
    </element_source>
  </roElementAction>
</mos>
                `
                socket.write(toUTF16BE(compressed(mos)));

            } else if (xml.includes("<roReq>")) {
                console.log(`received: ${xml}`);
                const mos2 = `
             <mos>
  <ncsID>DDNRCS</ncsID>
  <mosID>WTVISION.STUDIO.MOS</mosID>
  <roReplace>
    <roID>RO001</roID>
    <roSlug>My Rundown Title</roSlug>
    <roTrigger>MANUAL</roTrigger>
    <story>
      <storyID>202507031007311</storyID>
      <storySlug>slug</storySlug>
      <storyNum>1</storyNum>
      <item>
        <itemID>hhh</itemID>
        <objID>DD_TESTING,08bbb87d-c40e-409f-be92-06d538327548</objID>
        <mosID>SAMVAD</mosID>
        <itemType>GraphicPage</itemType>
        <Thumbnail>iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wD/AP+</Thumbnail>
        <metadata>
          <graphicID>DD_TESTING,08bbb87d-c40e-409f-be92-06d538327548</graphicID>
          <categoryColor>Green</categoryColor>
          <tags>
            <tag tN="tHeaderA" tT="2">मौसम ने ली करवट</tag>
            <tag tN="tHeaderB" tT="2">मौसम के कारण देश मे बाढ़ की स्तिथि</tag>
            <tag tN="vWindows" tT="Float">6</tag>
            <tag tN="tTextA01" tT="2">मौसम ने ली करवट 01</tag>
            <tag tN="tTextB01" tT="2">मौसम ने ली करवट 11</tag>
          </tags>
          <color>Green</color>
          <outputChannel>Channel 1</outputChannel>
          <autoUpdate>true</autoUpdate>
        </metadata>
      </item>
    </story>
  </roReplace>
</mos>


                `
                socket.write(toUTF16BE(compressed(mos2)));

            }
            else {
                console.log(`received: ${xml}`);
            }


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
