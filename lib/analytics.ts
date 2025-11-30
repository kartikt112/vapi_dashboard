import { Call, DashboardStats } from './types';

export function calculateStats(calls: Call[]): DashboardStats {
    const totalCalls = calls.length;

    // Calculate total duration in minutes (assuming duration is in seconds)
    // If duration is missing, assume 0
    const totalSeconds = calls.reduce((acc, call) => acc + (call.duration || 0), 0);
    // Round to 1 decimal place for minutes if needed, or just integer
    const totalMinutes = Math.round((totalSeconds / 60) * 10) / 10;

    const totalCost = calls.reduce((acc, call) => acc + (call.cost || 0), 0);

    // Count booked jobs based on summary keywords
    const bookedKeywords = ['booked', 'scheduled', 'appointment', 'confirmed', 'job secured'];
    const bookedJobs = calls.filter(call => {
        const summary = (call.summary || call.analysis?.summary || '').toLowerCase();
        return bookedKeywords.some(keyword => summary.includes(keyword));
    }).length;

    const totalRevenue = bookedJobs * 5000;

    return {
        totalCalls,
        totalMinutes,
        totalCost,
        bookedJobs,
        totalRevenue,
    };
}
