import { Overview } from "@/components/dashboard/overview";
import { CallsTable } from "@/components/dashboard/calls-table";
import { calculateStats } from "@/lib/analytics";
import { Call } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Download, RefreshCw } from "lucide-react";
import db from "@/lib/db";

export const dynamic = 'force-dynamic';

async function getCalls(): Promise<Call[]> {
  try {
    const calls = await db.call.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return calls.map((row: any) => ({
      ...row,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      customer: row.customerNumber ? {
        number: row.customerNumber,
        name: row.customerName || undefined,
      } : undefined,
      metadata: row.metadata ? JSON.parse(row.metadata) : undefined,
      analysis: row.analysis ? JSON.parse(row.analysis) : undefined,
      costBreakdown: row.costBreakdown ? JSON.parse(row.costBreakdown) : undefined,
    })) as unknown as Call[];
  } catch (e) {
    console.error(e);
    return [];
  }
}

async function syncData() {
  'use server';
  const apiKey = process.env.VAPI_API_KEY;

  if (!apiKey) {
    return { error: 'VAPI_API_KEY not configured' };
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
          duration = (end - start) / 1000;
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

    return {
      success: true,
      count: calls.length,
      message: `Synced ${calls.length} calls to database`
    };
  } catch (error) {
    console.error('Error syncing calls:', error);
    return {
      error: 'Failed to sync calls',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export default async function DashboardPage() {
  const calls = await getCalls();
  const stats = calculateStats(calls);

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold">Voice Agent Analytics</h1>
            <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              Connected
            </span>
          </div>
          <p className="text-muted-foreground">Monitor and analyze your voice agent performance in real-time</p>
        </div>
        <div className="flex items-center gap-2">
          <form action={syncData}>
            <Button type="submit" variant="outline" className="bg-white">
              <RefreshCw className="mr-2 h-4 w-4" />
              Sync Data
            </Button>
          </form>
          <Button variant="outline" className="bg-white">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Last 6 months
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Download className="mr-2 h-4 w-4" />
            Download Report (CSV)
          </Button>
        </div>
      </div>

      <Overview stats={stats} />

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Recent Calls</h2>
        <CallsTable calls={calls} />
      </div>
    </div>
  );
}
