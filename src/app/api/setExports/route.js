import { getR3Client } from '../../lib/r3client.js'

export async function POST(req) {
    const { project, scene, updates } = await req.json()
    const r3 = await getR3Client();

    for (const { name, value } of updates) {
        const command = `SCENE "${project}/${scene}" EXPORT "${name}" SetValue "${value}"`;
        await r3.sendCommand(command);
    }

    return new Response(JSON.stringify({ status: "Exports updated", updated: updates }))
}
