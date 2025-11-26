// app/api/unreal/remote/object/call/route.js
export async function POST(request) {
    try {
        const body = await request.json();

        // Take values from client, or use defaults
        const objectPath =
            body.objectPath ||
            "/Game/000_wTV_AR/Maps/UEDPIE_0_COMPOSITING_LEVEL_LevelInstance_1.COMPOSITING_LEVEL:PersistentLevel.RWR__C_3";

        const functionName = body.functionName || "SetX";

        // This should match parameter name in your BP function
        const parameters = body.Parameters || { float: 1 };

        const generateTransaction =
            body.GenerateTransaction !== undefined ? body.GenerateTransaction : true;

        // Unreal host/port
        const host = process.env.UNREAL_HOST || "192.168.15.137";
        const port = process.env.UNREAL_PORT || "30010";

        const ueUrl = `http://${host}:${port}/remote/object/call`;

        // 👇 IMPORTANT: keep the keys exactly like your working Python call
        const payload = {
            Parameters: parameters,
            GenerateTransaction: generateTransaction,
            functionName,
            objectPath,
        };

        const ueResp = await fetch(ueUrl, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Accept: "*/*",
            },
            body: JSON.stringify(payload),
        });

        const ueJson = await ueResp.json().catch(() => null);

        if (!ueResp.ok) {
            return new Response(
                JSON.stringify({ ok: false, status: ueResp.status, unreal: ueJson }),
                { status: 502, headers: { "Content-Type": "application/json" } }
            );
        }

        return new Response(
            JSON.stringify({
                ok: true,
                sent: payload,
                unreal: ueJson,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
