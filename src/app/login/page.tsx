"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { signIn } from "next-auth/react";

const formSchema = z.object({
  emailAddress: z.string().min(3),
  password: z.string().min(1, {
    message: "Please enter your password",
  }),
});

const registerFormSchema = z.object({
  username: z.string().min(3, {
    message: "Please enter your username",
  }),
  emailAddress: z.string().email(),
  password: z.string().min(1, {
    message: "Please enter your password",
  }),
  confirmPassword: z.string().min(1, {
    message: "Please confirm your password",
  }),
});

export default function Home() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailAddress: ""
    }
  });

  const registerForm = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: "",
      emailAddress: "",
      password: "",
      confirmPassword: "",
    }
  });

  const handleSubmit = (data : any) => {
    console.log("form: ", data);
    // pass emailAddress to both email and username fields, backend will try email first then username
    signIn("credentials", { email: data.emailAddress, username: data.emailAddress, password: data.password, callbackUrl: "/" });
  }

  const handleRegisterSubmit = (data : any) => {
    if (data.password !== data.confirmPassword) {
      toast("Oops!", {
        description: "Passwords do not match",
      });
      return;
    }
    fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({
        email: data.emailAddress,
        username: data.username,
        password: data.password,
        picture: "",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.ok) {
        signIn("credentials", { email: data.emailAddress, username: data.username, password: data.password, callbackUrl: "/" });
      } else {
        toast("Oops!", {
          description: "Something went wrong when creating your account. Please try again.",
        });
      }
    });
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center p-24">
      <div className="flex w-full flex-col items-center justify-center max-w-xl">
        <Tabs defaultValue="login" className="flex flex-col w-full items-center justify-center">
          <TabsList className="w-full">
            <TabsTrigger value="login" className="w-full">login</TabsTrigger>
            <TabsTrigger value="register" className="w-full">register</TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="w-full">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="w-full flex flex-col gap-4" 
              >
                <FormField
                  control={form.control}
                  name="emailAddress"
                  render={({ field }) => {
                    return <FormItem>
                      <FormLabel>Username or Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Username or Email"
                          type="text"
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
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="register" className="w-full">
            <Form {...registerForm}>
              <form
                onSubmit={registerForm.handleSubmit(handleRegisterSubmit)}
                className="w-full flex flex-col gap-4" 
              >
                <FormField
                  control={registerForm.control}
                  name="emailAddress"
                  render={({ field }) => {
                    return <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Email Address"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  }}
                />
                <FormField
                  control={registerForm.control}
                  name="username"
                  render={({ field }) => {
                    return <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Username"
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  }}
                />
                <FormField
                  control={registerForm.control}
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
                <FormField
                  control={registerForm.control}
                  name="confirmPassword"
                  render={({ field }) => {
                    return <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input placeholder="Confirm your password"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  }}
                />

                <Button type="submit" className="w-full">
                  Create Account
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
        <div className="mx-auto my-4 flex w-full items-center justify-evenly
            before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400
        after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400">
          
          or
          
        </div>
          
        <Button onClick={() => signIn("google", {callbackUrl: "/"})} variant="outline" className="w-full">
          Sign in With Google
        </Button>
      </div>
    </main >
  );
}