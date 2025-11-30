import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PhoneIncoming, PhoneOutgoing, Globe, Calendar, Clock, DollarSign, User } from "lucide-react";
import { format } from "date-fns";
import db from "@/lib/db";
import { Call } from "@/lib/types";

async function getCalls(): Promise<Call[]> {
    try {
        const calls = await db.call.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });

        return calls.map((row) => ({
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

function CallTypeIcon({ type }: { type: string }) {
    if (type === 'inboundPhoneCall') return <PhoneIncoming className="h-5 w-5 text-green-600" />;
    if (type === 'outboundPhoneCall') return <PhoneOutgoing className="h-5 w-5 text-blue-600" />;
    return <Globe className="h-5 w-5 text-purple-600" />;
}

export default async function CallLogsPage() {
    const calls = await getCalls();

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Call Logs</h1>
                    <p className="text-muted-foreground">View all your call history, transcripts, and details</p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-sm">
                        {calls.length} Total Calls
                    </Badge>
                </div>
            </div>

            <div className="space-y-4">
                {calls.length === 0 ? (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <p className="text-muted-foreground">No calls found. Sync data to see call logs.</p>
                        </CardContent>
                    </Card>
                ) : (
                    calls.map((call) => (
                        <Card key={call.id} className="overflow-hidden">
                            <CardHeader className="bg-gray-50 border-b">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <CallTypeIcon type={call.type} />
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <CardTitle className="text-lg">
                                                    {call.customer?.name || 'Unknown Caller'}
                                                </CardTitle>
                                                <Badge variant={call.status === 'ended' ? 'secondary' : 'default'}>
                                                    {call.status}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <User className="h-3 w-3" />
                                                    {call.customer?.number || 'No number'}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {format(new Date(call.createdAt), 'MMM d, yyyy HH:mm')}
                                                </div>
                                                {(call.duration || 0) > 0 && (
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {Math.floor((call.duration || 0) / 60)}m {Math.round((call.duration || 0) % 60)}s
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-1">
                                                    <DollarSign className="h-3 w-3" />
                                                    ${(call.cost || 0).toFixed(2)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                {/* Summary */}
                                {call.summary && (
                                    <div>
                                        <h4 className="text-sm font-semibold mb-2">Summary</h4>
                                        <p className="text-sm text-gray-700">{call.summary}</p>
                                    </div>
                                )}

                                {/* Transcript */}
                                {call.transcript && (
                                    <div>
                                        <h4 className="text-sm font-semibold mb-2">Transcript</h4>
                                        <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                                            <pre className="text-sm whitespace-pre-wrap font-mono text-gray-700">
                                                {call.transcript}
                                            </pre>
                                        </div>
                                    </div>
                                )}

                                {/* Recording URLs */}
                                {call.recordingUrl && (
                                    <div className="flex gap-2">
                                        <Button asChild variant="outline" size="sm">
                                            <a href={call.recordingUrl} target="_blank" rel="noopener noreferrer">
                                                Play Recording
                                            </a>
                                        </Button>
                                        {call.stereoRecordingUrl && (
                                            <Button asChild variant="outline" size="sm">
                                                <a href={call.stereoRecordingUrl} target="_blank" rel="noopener noreferrer">
                                                    Play Stereo Recording
                                                </a>
                                            </Button>
                                        )}
                                    </div>
                                )}

                                {/* Metadata */}
                                {call.metadata && Object.keys(call.metadata).length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-semibold mb-2">Metadata</h4>
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                {Object.entries(call.metadata).map(([key, value]) => (
                                                    <div key={key} className="flex gap-2">
                                                        <span className="font-medium text-gray-600">{key}:</span>
                                                        <span className="text-gray-700">{String(value)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
