// app/api/mosserver/start/route.js


import { NextResponse } from 'next/server';
import { startMosServer } from '../../../lib/mosServer';

export async function GET() {
    startMosServer();
    return NextResponse.json({ status: 'MOS TCP Server started' });
}
