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

        // Process calls in transaction
        await db.$transaction(
            calls.map((call: any) => {
                // Calculate duration in seconds from startedAt and endedAt
                let duration = 0;
                if (call.startedAt && call.endedAt) {
                    const start = new Date(call.startedAt).getTime();
                    const end = new Date(call.endedAt).getTime();
                    duration = (end - start) / 1000; // Convert milliseconds to seconds
                }

                return db.call.upsert({
                    where: { id: call.id },
                    update: {
                        orgId: call.orgId,
                        phoneNumberId: call.phoneNumberId || '',
                        type: call.type,
                        status: call.status,
                        endedReason: call.endedReason,
                        transcript: call.transcript,
                        recordingUrl: call.recordingUrl,
                        stereoRecordingUrl: call.stereoRecordingUrl,
                        summary: call.summary,
                        updatedAt: new Date(call.updatedAt),
                        startedAt: call.startedAt ? new Date(call.startedAt) : null,
                        endedAt: call.endedAt ? new Date(call.endedAt) : null,
                        cost: call.cost || 0,
                        duration: duration,
                        customerNumber: call.customer?.number,
                        customerName: call.customer?.name,
                        metadata: call.metadata ? JSON.stringify(call.metadata) : null,
                        analysis: call.analysis ? JSON.stringify(call.analysis) : null,
                        costBreakdown: call.costBreakdown ? JSON.stringify(call.costBreakdown) : null,
                    },
                    create: {
                        id: call.id,
                        orgId: call.orgId,
                        phoneNumberId: call.phoneNumberId || '',
                        type: call.type,
                        status: call.status,
                        endedReason: call.endedReason,
                        transcript: call.transcript,
                        recordingUrl: call.recordingUrl,
                        stereoRecordingUrl: call.stereoRecordingUrl,
                        summary: call.summary,
                        createdAt: new Date(call.createdAt),
                        updatedAt: new Date(call.updatedAt),
                        startedAt: call.startedAt ? new Date(call.startedAt) : null,
                        endedAt: call.endedAt ? new Date(call.endedAt) : null,
                        cost: call.cost || 0,
                        duration: duration,
                        customerNumber: call.customer?.number,
                        customerName: call.customer?.name,
                        metadata: call.metadata ? JSON.stringify(call.metadata) : null,
                        analysis: call.analysis ? JSON.stringify(call.analysis) : null,
                        costBreakdown: call.costBreakdown ? JSON.stringify(call.costBreakdown) : null,
                    },
                });
            })
        );

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
