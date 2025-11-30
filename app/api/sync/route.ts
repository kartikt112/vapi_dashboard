import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST() {
    const apiKey = process.env.VAPI_API_KEY;

    if (!apiKey) {
        return NextResponse.json({ error: 'VAPI_API_KEY not configured' }, { status: 500 });
    }

    try {
        // Fetch calls from Vapi API
        const response = await fetch('https://api.vapi.ai/call', {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Vapi API error: ${response.statusText}`);
        }

        const calls = await response.json();

        // Prepare insert/update statement
        const stmt = db.prepare(`
      INSERT OR REPLACE INTO calls (
        id, orgId, phoneNumberId, type, status, endedReason, transcript,
        recordingUrl, stereoRecordingUrl, summary, createdAt, updatedAt,
        startedAt, endedAt, cost, duration, customerNumber, customerName,
        metadata, analysis, costBreakdown
      ) VALUES (
        @id, @orgId, @phoneNumberId, @type, @status, @endedReason, @transcript,
        @recordingUrl, @stereoRecordingUrl, @summary, @createdAt, @updatedAt,
        @startedAt, @endedAt, @cost, @duration, @customerNumber, @customerName,
        @metadata, @analysis, @costBreakdown
      )
    `);

        const insertMany = db.transaction((callsData: any[]) => {
            for (const call of callsData) {
                // Calculate duration in seconds from startedAt and endedAt
                let duration = 0;
                if (call.startedAt && call.endedAt) {
                    const start = new Date(call.startedAt).getTime();
                    const end = new Date(call.endedAt).getTime();
                    duration = (end - start) / 1000; // Convert milliseconds to seconds
                }

                stmt.run({
                    id: call.id,
                    orgId: call.orgId,
                    phoneNumberId: call.phoneNumberId || null,
                    type: call.type,
                    status: call.status,
                    endedReason: call.endedReason || null,
                    transcript: call.transcript || null,
                    recordingUrl: call.recordingUrl || null,
                    stereoRecordingUrl: call.stereoRecordingUrl || null,
                    summary: call.summary || null,
                    createdAt: call.createdAt,
                    updatedAt: call.updatedAt,
                    startedAt: call.startedAt || null,
                    endedAt: call.endedAt || null,
                    cost: call.cost || 0,
                    duration: duration,
                    customerNumber: call.customer?.number || null,
                    customerName: call.customer?.name || null,
                    metadata: JSON.stringify(call.metadata || {}),
                    analysis: JSON.stringify(call.analysis || {}),
                    costBreakdown: JSON.stringify(call.costBreakdown || {}),
                });
            }
        });


        insertMany(calls);

        return NextResponse.json({
            success: true,
            count: calls.length,
            message: `Synced ${calls.length} calls to database`
        });
    } catch (error) {
        console.error('Error syncing calls:', error);
        return NextResponse.json({
            error: 'Failed to sync calls',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
