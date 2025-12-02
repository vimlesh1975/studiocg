// app/api/unreal/remote/object/describe/route.js
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const objectPath =
            searchParams.get("objectPath") ||
            "/Game/000_wTV_AR/Maps/COMPOSITING_LEVEL_LevelInstance_1.COMPOSITING_LEVEL:PersistentLevel.Cone_0";

        const host = process.env.UNREAL_HOST || "192.168.15.137";
        const port = process.env.UNREAL_PORT || "30010";
        const passphrase =
            process.env.UNREAL_PASSPHRASE || "c893ff3920f0e8568861a3a215a77f4f";

        const ueUrl = `http://${host}:${port}/remote/object/describe`;

        const payload = {
            objectPath,
            access: "READ_ACCESS",
        };

        const ueResp = await fetch(ueUrl, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Accept: "*/*",
                Passphrase: passphrase,
            },
            body: JSON.stringify(payload),
        });

        const ueJson = await ueResp.json().catch(() => null);

        if (!ueResp.ok) {
            return new Response(
                JSON.stringify({
                    ok: false,
                    status: ueResp.status,
                    unreal: ueJson,
                }),
                { status: 502, headers: { "Content-Type": "application/json" } }
            );
        }

        return new Response(
            JSON.stringify({ ok: true, objectPath, data: ueJson }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
