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
  const response = await fetch('http://localhost:3000/api/sync', {
    method: 'POST',
    cache: 'no-store',
  });
  return response.json();
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
