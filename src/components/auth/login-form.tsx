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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppContext } from "@/context/app-context";
import type { Role } from "@/lib/types";

const FormSchema = z.object({
  role: z.enum(["team-leader", "advisor"], {
    required_error: "You need to select a role.",
  }),
  advisorId: z.string().optional(),
}).refine(data => {
    if (data.role === 'advisor') {
        return !!data.advisorId;
    }
    return true;
}, {
    message: "You need to select an advisor.",
    path: ["advisorId"],
});

export function LoginForm() {
  const router = useRouter();
  const { advisors } = useAppContext();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const role = form.watch("role");

  useEffect(() => {
    setSelectedRole(role);
    form.setValue("advisorId", undefined);
  }, [role, form]);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    localStorage.setItem("userRole", data.role);
    if (data.role === "advisor" && data.advisorId) {
      localStorage.setItem("userId", data.advisorId);
    }
    router.push("/dashboard");
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
            <FormField
            control={form.control}
            name="advisorId"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Advisor</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select your name" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    {advisors.map(advisor => (
                        <SelectItem key={advisor.id} value={advisor.id}>{advisor.name}</SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
        )}

        <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Login</Button>
      </form>
    </Form>
  );
}
