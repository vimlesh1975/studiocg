import { getR3Client } from '../../lib/r3client.js'

let lastScene = null;

export async function POST(req) {
    const { project, scene, timeline, slot = "0" } = await req.json()
    console.log(project, scene, timeline)
    const r3 = await getR3Client();
    if (timeline === "In") {
        const sceneObj = await r3.loadScene(project, scene)
        await sceneObj.takeOnline(slot) //must be string
        await sceneObj.playTimeline(timeline)
    }
    else {
        const command = `SCENE "${project}/${scene}" ANIMATION "${timeline}" PLAY`;
        r3.sendCommand(command)
    }
    return new Response(JSON.stringify({ status: `Played timeline ${timeline}` }))
}
