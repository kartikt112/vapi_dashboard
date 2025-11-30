import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CallDetailPage({ params }: { params: { id: string } }) {
    return (
        <div className="p-8">
            <Button asChild variant="ghost" className="mb-4">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Link>
            </Button>
            <h1 className="text-2xl font-bold">Call Details: {params.id}</h1>
            <p className="text-muted-foreground mt-2">Detailed view coming soon.</p>
        </div>
    );
}
