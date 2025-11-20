// app/api/unreal/remote/object/call-location/route.js
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const objectPath = searchParams.get("objectPath");
        // default to actor component path for SkyLight if not provided
        const target = objectPath || "/Game/Main.Main:PersistentLevel.SkyLight_1.SkyLightComponent0";

        const ueUrl = `http://${process.env.UNREAL_HOST || "localhost"}:${process.env.UNREAL_PORT || "30010"}/remote/object/call`;

        const payload = {
            objectPath: "/Game/Main.Main:PersistentLevel.SkyLight_1", // actor path
            functionName: "GetActorLocation",
            parameters: {}
        };


        const ueResp = await fetch(ueUrl, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const ueJson = await ueResp.json().catch(() => null);

        if (!ueResp.ok) {
            return new Response(JSON.stringify({ ok: false, status: ueResp.status, unreal: ueJson }), {
                status: 502,
                headers: { "Content-Type": "application/json" }
            });
        }

        // Unreal typically returns the FVector in a field like "ReturnValue" or similar.
        // We try to extract common shapes:
        let location = null;
        if (ueJson && typeof ueJson === "object") {
            // search for properties that look like a vector
            const tryPaths = ["ReturnValue", "return", "result"];
            for (const p of tryPaths) {
                if (ueJson[p] && typeof ueJson[p] === "object" &&
                    ("X" in ueJson[p] || "x" in ueJson[p])) {
                    const v = ueJson[p];
                    location = { x: v.X ?? v.x, y: v.Y ?? v.y, z: v.Z ?? v.z };
                    break;
                }
            }
            // fallback: if top-level has X/Y/Z
            if (!location && ("X" in ueJson || "x" in ueJson)) {
                location = { x: ueJson.X ?? ueJson.x, y: ueJson.Y ?? ueJson.y, z: ueJson.Z ?? ueJson.z };
            }
        }

        return new Response(JSON.stringify({ ok: true, objectPath: target, raw: ueJson, location }), {
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
