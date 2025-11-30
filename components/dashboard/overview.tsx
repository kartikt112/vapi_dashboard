import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardStats } from "@/lib/types";
import { Clock, CheckCircle, DollarSign, Users, Phone, MessageSquare, Mail } from "lucide-react";

interface OverviewProps {
    stats: DashboardStats;
}

export function Overview({ stats }: OverviewProps) {
    return (
        <div className="space-y-4">
            {/* Top Row: Leads Stats (Mocked for now) */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Leads Generated</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">258</div>
                        <p className="text-xs text-muted-foreground">+12.5% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Leads Called</CardTitle>
                        <Phone className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalCalls}</div>
                        <p className="text-xs text-muted-foreground">+8.3% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sent SMS</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">189</div>
                        <p className="text-xs text-muted-foreground">+15.2% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sent Emails</CardTitle>
                        <Mail className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">145</div>
                        <p className="text-xs text-muted-foreground">+9.7% from last month</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Stats Row */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-blue-600 text-white border-none shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-blue-100">Saved Minutes</CardTitle>
                        <Clock className="h-4 w-4 text-blue-100" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalMinutes.toLocaleString()} minutes</div>
                        <div className="mt-4 space-y-1">
                            <div className="flex justify-between text-xs text-blue-100">
                                <span>Calls ({stats.totalCalls} x avg)</span>
                                <span>{stats.totalMinutes} min</span>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-blue-500/30 flex items-center text-xs text-blue-100">
                            <span className="mr-2">⚡</span>
                            ≈ {Math.round(stats.totalMinutes / 60)} hours of productivity
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-green-600 text-white border-none shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-green-100">Booked Jobs</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-100" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.bookedJobs} jobs secured</div>
                        <div className="mt-4">
                            <div className="flex justify-between text-xs text-green-100 mb-1">
                                <span>Conversion Rate</span>
                                <span>{stats.totalCalls > 0 ? ((stats.bookedJobs / stats.totalCalls) * 100).toFixed(1) : 0}%</span>
                            </div>
                            <div className="h-2 w-full bg-green-800/50 rounded-full overflow-hidden">
                                <div className="h-full bg-white" style={{ width: `${stats.totalCalls > 0 ? (stats.bookedJobs / stats.totalCalls) * 100 : 0}%` }} />
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-green-500/30 flex items-center text-xs text-green-100">
                            <span className="mr-2">↗</span>
                            Avg order: $5,000
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-purple-600 text-white border-none shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-purple-100">Total Order Value</CardTitle>
                        <DollarSign className="h-4 w-4 text-purple-100" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
                        <div className="mt-4 space-y-1">
                            <div className="flex justify-between text-xs text-purple-100">
                                <span>Jobs Completed</span>
                                <span>{stats.bookedJobs}</span>
                            </div>
                            <div className="flex justify-between text-xs text-purple-100">
                                <span>Average Value</span>
                                <span>$5,000</span>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-purple-500/30 flex items-center text-xs text-purple-100">
                            <span className="mr-2">↗</span>
                            Strong ROI performance
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
