// src/app/api/mongodb/runorders/route.js
import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGOURI;;
const dbName = 'slidecg';

export async function GET() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db(dbName);
        const runorders = await db.collection('shows').find({}).toArray();
        return NextResponse.json({ runorders });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    } finally {
        await client.close();
    }
}
