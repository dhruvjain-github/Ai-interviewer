import { AssemblyAI } from 'assemblyai'
import { NextResponse } from 'next/server'

const assemblyAi = new AssemblyAI({ apiKey: process.env.ASSEMBLY_API_KEY! });

export async function GET(req: Request) {
    const token = await assemblyAi.realtime.createTemporaryToken({ expires_in: 4200 });
    return NextResponse.json(token);
}
