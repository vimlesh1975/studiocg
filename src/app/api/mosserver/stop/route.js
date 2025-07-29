// /api/mosserver/stop.js
import { stopMosServer } from '../../../lib/mosServer';

export async function GET(req) {
    stopMosServer();
    return Response.json({ status: 'MOS Server stopped' });
}
