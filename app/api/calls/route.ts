import { NextResponse } from 'next/server';

export async function GET() {
    const apiKey = process.env.VAPI_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: 'VAPI_API_KEY not configured' }, { status: 500 });
    }

    try {
        const response = await fetch('https://api.vapi.ai/call', {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Vapi API error: ${response.statusText}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching calls:', error);
        return NextResponse.json({ error: 'Failed to fetch calls' }, { status: 500 });
    }
}
