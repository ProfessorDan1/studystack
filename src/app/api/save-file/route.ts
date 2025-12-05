import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, type, size, url } = data;

    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();

    await client.query(
      `INSERT INTO files (name, type, size, url) VALUES ($1, $2, $3, $4)`,
      [name, type, size, url]
    );

    await client.end();
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    let message = 'Unknown error';
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ success: false, error: message });
  }
}
