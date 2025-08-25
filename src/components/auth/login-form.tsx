"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppContext } from "@/context/app-context";
import type { Role } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const FormSchema = z.object({
  role: z.enum(["team-leader", "advisor"], {
    required_error: "You need to select a role.",
  }),
  email: z.string().email({ message: "Please enter a valid email." }).optional().or(z.literal('')),
  password: z.string().optional().or(z.literal('')),
}).refine(data => {
    if (data.role === 'advisor') {
        return !!data.email && !!data.password;
    }
    return true;
}, {
    message: "Email and password are required for advisors.",
    path: ["email"],
});

export function LoginForm() {
  const router = useRouter();
  const { loginAdvisor } = useAppContext();
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const role = form.watch("role");

  useEffect(() => {
    setSelectedRole(role);
    form.reset({
      role: role,
      email: '',
      password: ''
    });
  }, [role, form]);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    localStorage.removeItem("userId");
    
    if (data.role === 'team-leader') {
      localStorage.setItem("userRole", data.role);
      router.push("/dashboard");
      return;
    }

    if (data.role === 'advisor' && data.email && data.password) {
        const advisor = loginAdvisor(data.email, data.password);
        if (advisor) {
            localStorage.setItem("userRole", data.role);
            localStorage.setItem("userId", advisor.id);
            router.push("/dashboard");
        } else {
            toast({
                variant: "destructive",
                title: "Login Failed",
                description: "Invalid email or password.",
            });
            form.setError("password", { type: "manual", message: "Invalid credentials" });
        }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="team-leader">Team Leader</SelectItem>
                  <SelectItem value="advisor">Advisor</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedRole === "advisor" && (
            <>
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input placeholder="your.email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input type="password" placeholder="********" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </>
        )}

        <Button type="submit" className="w-full text-lg py-6 font-semibold">Login</Button>
      </form>
    </Form>
  );
}
