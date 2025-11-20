// app/api/unreal/remote/object/set-actor-location/route.js
export async function POST(request) {
    try {
        const body = await request.json();
        const actorPath = body.objectPath || "/Game/Main.Main:PersistentLevel.SkyLight_1"; // actor path
        const x = Number(body.x ?? 0);
        const y = Number(body.y ?? 0);
        const z = Number(body.z ?? 0);

        const host = process.env.UNREAL_HOST || "localhost";
        const port = process.env.UNREAL_PORT || "30010";
        const ueUrl = `http://${host}:${port}/remote/object/call`;

        // Call SetActorLocation(actorPath, NewLocation)
        const payload = {
            objectPath: actorPath,
            functionName: "SetActorLocation",
            parameters: {
                NewLocation: { X: x, Y: y, Z: z }
            },
            generateTransaction: true
        };

        const ueResp = await fetch(ueUrl, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const ueJson = await ueResp.json().catch(() => null);

        if (!ueResp.ok) {
            return new Response(JSON.stringify({ ok: false, status: ueResp.status, unreal: ueJson }), {
                status: 502,
                headers: { "Content-Type": "application/json" }
            });
        }

        return new Response(JSON.stringify({ ok: true, actorPath, requested: { x, y, z }, raw: ueJson }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
