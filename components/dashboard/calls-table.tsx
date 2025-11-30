import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Call } from "@/lib/types";
import { format } from "date-fns";
import { PhoneIncoming, PhoneOutgoing, Globe } from "lucide-react";
import Link from "next/link";

interface CallsTableProps {
    calls: Call[];
}

export function CallsTable({ calls }: CallsTableProps) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Status</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Summary</TableHead>
                        <TableHead>Cost</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {calls.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center h-24">
                                No calls found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        calls.map((call) => (
                            <TableRow key={call.id}>
                                <TableCell>
                                    <Badge variant={call.status === 'ended' ? 'secondary' : 'default'}>
                                        {call.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {call.type === 'inboundPhoneCall' && <PhoneIncoming className="h-4 w-4" />}
                                        {call.type === 'outboundPhoneCall' && <PhoneOutgoing className="h-4 w-4" />}
                                        {call.type === 'webCall' && <Globe className="h-4 w-4" />}
                                        <span className="capitalize">{call.type.replace(/([A-Z])/g, ' $1').trim()}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{format(new Date(call.createdAt), 'MMM d, yyyy HH:mm')}</TableCell>
                                <TableCell>
                                    {call.duration ? `${Math.floor(call.duration / 60)}m ${Math.round(call.duration % 60)}s` : '-'}
                                </TableCell>
                                <TableCell className="max-w-[300px] truncate" title={call.summary || call.analysis?.summary}>
                                    {call.summary || call.analysis?.summary || '-'}
                                </TableCell>
                                <TableCell>${(call.cost || 0).toFixed(2)}</TableCell>
                                <TableCell className="text-right">
                                    <Button asChild variant="outline" size="sm">
                                        <Link href={`/call/${call.id}`}>View</Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
