// /api/unreal/remote/info/route.js
export async function GET() {
    try {
        const url = `http://${process.env.UNREAL_HOST}:${process.env.UNREAL_PORT}/remote/info`;
        // const url = "http://localhost:30010/remote/info"

        const response = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            cache: "no-store"
        });

        const data = await response.json();

        return Response.json({ ok: true, data });
    } catch (error) {
        return Response.json({ ok: false, error: error.message }, { status: 500 });
    }
}
