export interface Call {
    id: string;
    orgId: string;
    createdAt: string;
    updatedAt: string;
    type: 'inboundPhoneCall' | 'outboundPhoneCall' | 'webCall';
    status: string;
    endedReason?: string;
    transcript?: string;
    recordingUrl?: string;
    stereoRecordingUrl?: string;
    summary?: string;
    duration?: number;
    cost?: number;
    customer?: {
        number: string;
        name?: string;
    };
    metadata?: Record<string, any>;
    analysis?: {
        summary?: string;
        structuredData?: any;
        successEvaluation?: string;
    };
}

export interface DashboardStats {
    totalCalls: number;
    totalMinutes: number;
    totalCost: number;
    bookedJobs: number;
    totalRevenue: number;
}
