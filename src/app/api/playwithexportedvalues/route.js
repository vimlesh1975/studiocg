import { getR3Client } from '../../lib/r3client.js'
export async function POST(req) {
    const { project, scene, timeline, exportedvalues, slot = "0" } = await req.json()
    const r3 = await getR3Client();
    const sceneObj = await r3.loadScene(project, scene)
    if (!sceneObj) {
        return new Response(JSON.stringify({ error: "Scene not loaded" }), { status: 404 })
    }

    if (timeline === "In") {
        for (const { name, value } of exportedvalues) {
            await sceneObj.setExport(name, value)
        }
        await sceneObj.takeOnline(slot);
        await sceneObj.playTimeline("In")

    } else if (timeline === "Out") {
        await sceneObj.playTimeline("Out")

        // Wait before taking offline
        await new Promise((resolve) => setTimeout(resolve, 2000))

        await sceneObj.takeOffline()
        await r3.disconnect()
    }
    else {
        for (const { name, value } of exportedvalues) {
            await sceneObj.setExport(name, value)
        }
        const command = `SCENE "${project}/${scene}" ANIMATION "${timeline}" PLAY`;
        r3.sendCommand(command)
    }

    return new Response(JSON.stringify({ status: `Played timeline ${timeline}` }))
}
