import { NextResponse } from 'next/server';
import { getMosTcpClient } from '../../../lib/mosTcpClient.js';
import { toUTF16BE, fix, mosStart, mos, compressed } from '../../../lib/common.js';
import mysql from 'mysql2/promise';
import { config } from '../../../lib/db.js';


export async function POST(req) {

  const selectedDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }



  try {
    const { selectedRunOrderTitle = '0600 Hrs' } = await req.json();
    const connection = await mysql.createConnection(config);

    // Fetch script rows
    const [rows] = await connection.execute(
      `
            SELECT *
            FROM script
            WHERE deleted = 0
              AND bulletinname = ?
              AND bulletindate = ?
              ORDER BY slno
          `,
      [selectedRunOrderTitle, selectedDate()]
    );

    // Fetch graphics rows
    const [graphicsrows] = await connection.execute(
      `SELECT * FROM graphics2 ORDER BY ScriptID, slno`
    );


    // Build graphics lookup by ScriptID
    const graphicsMap = {};
    for (const graphic of graphicsrows) {
      const scriptID = graphic.ScriptID;
      if (!graphicsMap[scriptID]) {
        graphicsMap[scriptID] = [];
      }
      graphicsMap[scriptID].push(graphic);
    }

    for (const scriptID in graphicsMap) {
      graphicsMap[scriptID].sort((a, b) => (a.slno || 0) - (b.slno || 0));
    }


    console.log("✅ Rows fetched:", rows.length);




    if (rows.length === 0) {
      return NextResponse.json({ message: "⚠️ No rows found." });
    }

    // const client = await getMosTcpClient();

    const roID = `${process.env.MOS_DEVICE_ID}_RO`;

    let storiesXml = "";

    for (let i = 0; i < rows.length; i++) {
      const story = rows[i];

      const storyID = story.ScriptID || `STORY${i + 1}`;
      const storySlug = story.SlugName || `Story ${i + 1}`;

      const graphicsForStory = graphicsMap[storyID] || [];

      let itemsXml = "";

      if (graphicsForStory.length > 0) {
        for (let j = 0; j < graphicsForStory.length; j++) {
          const graphic = graphicsForStory[j];

          const itemID = `item_${storyID}_${j + 1}`;


          const objID = `${process.env.PROJECT_NAME},${graphic.gfxpart3}`;
          const graphicID = objID;
          const mosID = 'SAMVAD';
          const itemType = 'GraphicPage';
          const thumbnail = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wD/AP+';
          const categoryColor = 'Green';
          const outputChannel = 'Channel 1';
          const autoUpdate = 'true';



          let tags = [];

          try {
            const gfxTemplate = JSON.parse(graphic.gfxtemplatetext);
            for (const [tagName, tagDetails] of Object.entries(gfxTemplate.pageValue)) {
              tags.push({
                tN: tagName,
                tT: tagDetails.type,
                tV: tagDetails.value
              });
            }
          } catch (err) {
            console.error("⚠️ Could not parse gfxTemplateText:", err);
          }

          const tagsXml = tags
            .map(tag => `              <tag tN="${tag.tN}" tT="${tag.tT}">${tag.tV}</tag>`)
            .join('\n');


          const itemXml = `
            <item>
              <itemID>${itemID}</itemID>
              <objID>${objID}</objID>
              <mosID>${mosID}</mosID>
              <itemType>${itemType}</itemType>
              <Thumbnail>${thumbnail}</Thumbnail>
              <metadata>
                <graphicID>${graphicID}</graphicID>
                <categoryColor>${categoryColor}</categoryColor>
                <tags>
${tagsXml}
                </tags>
                <color>${categoryColor}</color>
                <outputChannel>${outputChannel}</outputChannel>
                <autoUpdate>${autoUpdate}</autoUpdate>
              </metadata>
            </item>`.trim();

          itemsXml += `\n${itemXml}`;
        }
      }

      const storyXml = `
        <story>
          <storyID>${storyID}</storyID>
          <storySlug>${storySlug}</storySlug>
          ${itemsXml}
        </story>`.trim();

      storiesXml += `\n${storyXml}`;
    }

    // Build single MOS message
    const mosXml = `
                <mos>
                  <ncsID>DDNRCS</ncsID>
                  <mosID>WTVISION.STUDIO.MOS</mosID>
                  <roReplace>
                    <roID>${roID}</roID>
                    <roSlug>RO_Slug</roSlug>
                ${storiesXml}
                  </roReplace>
                </mos>`.trim();

    // Instead of sending it right now, just return it to the caller:
    return NextResponse.json({
      message: "✅ MOS message built successfully.",
      mosXml
    });

  } catch (err) {
    console.error("❌ Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
