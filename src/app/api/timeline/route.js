import { getR3Client } from '../../lib/r3client.js'

export async function POST(req) {
    const { project, scene, timeline, slot = "0" } = await req.json()
    console.log(project, scene, timeline)
    const r3 = await getR3Client();
    if (timeline === "In") {
        const sceneObj = await r3.loadScene(project, scene)
        await sceneObj.takeOnline(slot) //must be string
        await sceneObj.playTimeline(timeline)
    }
    if (timeline === "Out") {
        const sceneObj = await r3.loadScene(project, scene)
        await sceneObj.playTimeline(timeline)
        await new Promise(r => setTimeout(r, 3000)); // 100ms delay
        await sceneObj.takeOffline() //must be string
        r3.sendCommand(`engine unloadscene "${project}/${scene}"`)
        // await sceneObj.unloadscene()//not working
    }
    else {
        const command = `SCENE "${project}/${scene}" ANIMATION "${timeline}" PLAY`;
        r3.sendCommand(command)
    }
    return new Response(JSON.stringify({ status: `Played timeline ${timeline}` }))
}
