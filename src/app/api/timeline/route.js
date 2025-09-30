import { getR3Client } from '../../lib/r3client.js'

let lastScene = null;

export async function POST(req) {
    const { project, scene, timeline, slot = "0" } = await req.json()
    console.log(project, scene, timeline)
    const r3 = await getR3Client();


    // const sceneObj = await r3.loadScene(project, scene)
    if (lastScene && lastScene !== `${project}/${scene}`) {
        await r3.sendCommand(`engine unloadscene "${lastScene}"`);
    }
    const sceneObj = await r3.loadScene(project, scene);
    lastScene = `${project}/${scene}`;

    if (!sceneObj) {
        return new Response(JSON.stringify({ error: "Scene not loaded" }), { status: 404 })
    }
    if (timeline === "Out") {
        await sceneObj.playTimeline("Out")
        await new Promise((resolve) => setTimeout(resolve, 2000))
        await sceneObj.takeOffline()
        await r3.sendCommand(`engine unloadscene "${project}/${scene}"`)
    }
    else if (timeline === "In") {
        await sceneObj.takeOnline(slot) //must be string
        await sceneObj.playTimeline(timeline)

    }
    else {
        await sceneObj.playTimeline(timeline)
    }
    return new Response(JSON.stringify({ status: `Played timeline ${timeline}` }))
}
