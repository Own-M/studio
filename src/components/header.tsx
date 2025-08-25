"use client";

import { LogOut, Users } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export function Header() {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("userRole");
        localStorage.removeItem("userId");
        router.push('/');
    }
  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6 z-10 shadow-sm">
        <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">LeadFlow Manager</h1>
        </div>
        <div className="ml-auto">
            <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
            </Button>
        </div>
    </header>
  );
}
