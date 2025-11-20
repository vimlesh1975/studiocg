// app/api/remote/object/property/route.js
export async function GET(request) {
    console.log(request)
    try {
        const { searchParams } = new URL(request.url);
        const objectPath = searchParams.get("objectPath");

        if (!objectPath) {
            return new Response(
                JSON.stringify({ ok: false, error: "Missing query parameter: objectPath" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Remote Control API endpoint
        const ueUrl = `http://${process.env.UNREAL_HOST}:${process.env.UNREAL_PORT}/remote/object/property`;

        // Body for READ access
        const body = {
            objectPath,
            access: "READ_ACCESS"
        };

        const ueResp = await fetch(ueUrl, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        // forward status if Unreal returned an error
        const ueJson = await ueResp.json().catch(() => null);

        if (!ueResp.ok) {
            return new Response(JSON.stringify({ ok: false, status: ueResp.status, unreal: ueJson }), {
                status: 502,
                headers: { "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify({ ok: true, objectPath, properties: ueJson }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
