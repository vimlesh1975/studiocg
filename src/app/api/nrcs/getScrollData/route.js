import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { config } from '../../../lib/db.js';

export async function POST(req) {
    let connection;
    try {
        const body = await req.json();
        const { bulletinname, bulletindate } = body;
        connection = await mysql.createConnection(config);

        const [rows] = await connection.execute(
            `SELECT * FROM script WHERE bulletinname=? and bulletindate=?`,
            [bulletinname, bulletindate]
        );
        return new Response(JSON.stringify({ data: rows }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error deleting graphic:', error);
        return NextResponse.json(
            { error: 'An error occurred while deleting the graphic' },
            { status: 500 }
        );
    } finally {
        if (connection) {
            await connection.end(); // ✅ Ensures connection is closed
        }
    }
}
