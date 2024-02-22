"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formShcema = z.object({
  emailAddress: z.string().email(),
  password: z.string().min(1, {
    message: "Please enter your password",
  }),
});

export default function Home() {
  const form = useForm<z.infer<typeof formShcema>>({
    resolver: zodResolver(formShcema),
    defaultValues: {
      emailAddress: ""
    }
  });

  const handleSubmit = () => { }

  return (
    <main className="flex min-h-screen items-center justify-center p-24">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="max-w-md w-full flex flex-col gap-4" 
        >
          <FormField
            control={form.control}
            name="emailAddress"
            render={({ field }) => {
              return <FormItem>
                <FormLabel>Username or Email</FormLabel>
                <FormControl>
                  <Input placeholder="Username or Email"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            }}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => {
              return <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            }}
          />

          <Button type="submit" className="w-full">
            Login
          </Button>

          <div className="mx-auto my-4 flex w-full items-center justify-evenly
          before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400
          after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400">
            
            Or
            
          </div>
           
          <Button variant="outline" className="w-full">
            Sign in With SSO
          </Button>
          
        </form>
      </Form>
    </main >
  );
}