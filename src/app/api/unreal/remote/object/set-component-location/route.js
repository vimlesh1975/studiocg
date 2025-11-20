// app/api/unreal/remote/object/set-component-location/route.js
export async function POST(request) {
    try {
        const body = await request.json();
        // componentPath example: /Game/Main.Main:PersistentLevel.SkyLight_1.SkyLightComponent0
        const compPath = body.componentPath || "/Game/Main.Main:PersistentLevel.SkyLight_1.SkyLightComponent0";
        const x = Number(body.x ?? 0);
        const y = Number(body.y ?? 0);
        const z = Number(body.z ?? 0);

        const host = process.env.UNREAL_HOST || "localhost";
        const port = process.env.UNREAL_PORT || "30010";
        const ueUrl = `http://${host}:${port}/remote/object/property`;

        // propertyValue to set component RelativeLocation
        const payload = {
            objectPath: compPath,
            access: "WRITE_TRANSACTION_ACCESS",
            propertyValue: {
                RelativeLocation: { X: x, Y: y, Z: z }
            }
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

        return new Response(JSON.stringify({ ok: true, componentPath: compPath, requested: { x, y, z }, raw: ueJson }), {
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
