import Link from "next/link";
import { LayoutDashboard, Phone, User } from "lucide-react";

export function Sidebar() {
    return (
        <div className="w-64 bg-white border-r h-screen flex flex-col fixed left-0 top-0 z-10">
            <div className="p-6">
                <div className="flex items-center gap-2 mb-8">
                    <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">UR</div>
                    <div>
                        <h1 className="font-bold text-sm">Ultimate Roofing</h1>
                        <p className="text-[10px] text-muted-foreground">TX</p>
                    </div>
                </div>

                <nav className="space-y-1">
                    <Link href="/" className="flex items-center gap-3 px-3 py-2 text-sm font-medium bg-blue-600 text-white rounded-md shadow-sm">
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                    </Link>
                    <Link href="/calls" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md">
                        <Phone className="h-4 w-4" />
                        Call Logs
                    </Link>
                </nav>
            </div>

            <div className="mt-auto p-6 border-t">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-500" />
                    </div>
                    <div>
                        <p className="text-sm font-medium">Account</p>
                        <p className="text-xs text-muted-foreground">info@ultimateroofintx.com</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
