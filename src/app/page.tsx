import { LoginForm } from "@/components/auth/login-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl rounded-2xl">
          <CardHeader>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4 border-8 border-primary/20">
                <Users className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-bold tracking-tight">LeadFlow Manager</CardTitle>
              <CardDescription className="text-muted-foreground pt-1">Sign in to access your dashboard</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
