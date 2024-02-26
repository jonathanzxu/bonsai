"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

import * as AvatarPrimative from '@radix-ui/react-avatar';

function AvatarPart(){
    return (
        <Avatar>
            <AvatarImage src = "http://tinyurl.com/yv8cestb" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
        </Avatar>
    )
}

function AvatarChange(){
  return (
    <AvatarPrimative.Root className="AvatarRoot h-1000 w-1000">
      <AvatarPrimative.Image
        className="AvatarImage"
        src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80"
        alt="Colm Tuite"
      />
      <AvatarPrimative.Fallback className="AvatarFallback" delayMs={600}>
        CT
      </AvatarPrimative.Fallback>
    </AvatarPrimative.Root>
  )
  
}

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

const formSchemaEM = z.object({
  email: z.string().email()
});

const formSchemaPW = z
.object({
  passwordPrev: z.string(),
  password: z.string(),
  passwordConfirm: z.string(),
})
.refine((data) => {
    return data.password === data.passwordConfirm
  }, {
    message: "Passwords do not match",
    path: ["passwordConfirm"]
  }
)

export default function ProfileForm() {
  // Username
   // 1. Define your form.
   const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  })
 
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  //email
  // 1. Define your form.
  const formEM = useForm<z.infer<typeof formSchemaEM>>({
    resolver: zodResolver(formSchemaEM),
    defaultValues: {
      email: "",
    },
  })
 
  // 2. Define a submit handler.
  function onSubmitEM(values: z.infer<typeof formSchemaEM>) {
    console.log(values)
  }

  //password
  const formPW = useForm<z.infer<typeof formSchemaPW>>({
    resolver: zodResolver(formSchemaPW),
    defaultValues: {
      password: "",
      passwordConfirm: "",
      passwordPrev: "",
    }
  })

  function onSubmitPW(values: z.infer<typeof formSchemaPW>){
    console.log(values)
  }


  return (
    <>
    <div className = "flex p-12">
    <AvatarChange/>
    <div className = "flex-1 p-10">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0 ">
      <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Change Username</FormLabel>
              <FormControl>
                <Input 
                placeholder="Username"
                type = "username" 
                {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit">Submit</Button>
      </form>
    </Form>
    <Form {...formEM}>
      <form onSubmit={formEM.handleSubmit(onSubmitEM)} className="space-y-0">
      <FormField
          control={formEM.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Change Email Address</FormLabel>
              <FormControl>
                <Input 
                placeholder="Email"
                type = "email"
                {...field} />
              </FormControl>
              <FormDescription>
                Your account email
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
    <Form {...formPW}>
      <form onSubmit={formPW.handleSubmit(onSubmitPW)} className="space-y-0">
      <FormField
          control={formPW.control}
          name="passwordPrev"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <Input placeholder="Current Password" {...field} />
              </FormControl>
              <FormDescription>
                Your current account password
              </FormDescription>
              <FormMessage />
            </FormItem>
        )}
      />
      <FormField
          control={formPW.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input 
                placeholder="Password" 
                type = "password"
                {...field} />
              </FormControl>
              <FormDescription>
                Your account password
              </FormDescription>
              <FormMessage />
            </FormItem>
        )}
      />
      <FormField
          control={formPW.control}
          name="passwordConfirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password Confirm</FormLabel>
              <FormControl>
                <Input placeholder="Password Confirm" {...field} />
              </FormControl>
              <FormDescription>
              </FormDescription>
              <FormMessage />
            </FormItem>
        )}
      />
      
      <Button type="submit">Submit</Button>
      </form>
    </Form>
    </div>
    </div>
    </>
  )
}
