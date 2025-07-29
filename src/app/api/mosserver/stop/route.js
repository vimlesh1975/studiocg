// /api/mosserver/stop.js
import { stopMosServer } from '../../../mosServer.js';

export async function GET(req) {
    stopMosServer();
    return Response.json({ status: 'MOS Server stopped' });
}
