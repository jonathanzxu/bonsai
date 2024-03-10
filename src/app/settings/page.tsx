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
import {getSession, signIn} from 'next-auth/react';

import * as AvatarPrimative from '@radix-ui/react-avatar';
import {useEffect, useState} from "react";
import {toast} from "sonner";


function AvatarChange(){
    const [user, setUser] = useState(undefined);
    useEffect(() => {
        getSession().then((user) => {
            setUser((user as any).user);
        });
    }, []);
    const defaultImage = "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80";
    const imageSrc = user?.picture || defaultImage;
    const altText = user?.username || "Default User";

    return (
        <AvatarPrimative.Root className="AvatarRoot h-500 w-500">
            <AvatarPrimative.Image
                className="AvatarImage"
                src={imageSrc}
                alt={altText}
                style={{maxHeight: '500px', maxWidth: '500px'}}
            />
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

const formSchemaAV = z.object({
  image: z.string().url()
})

export default function ProfileForm() {
    //username
   const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
      const response = await fetch('/api/change-username', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              newUsername: values.username,
          }),
      }).then((res) => {
          if (res.ok) {
              console.error('Changed username');
          } else {
              console.error('Could not change username');
          }
      });
  }

  //email
  const formEM = useForm<z.infer<typeof formSchemaEM>>({
    resolver: zodResolver(formSchemaEM),
    defaultValues: {
      email: "",
    },
  })

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

  //Avatar
  const formAV = useForm<z.infer<typeof formSchemaAV>>({
    resolver: zodResolver(formSchemaAV),
    defaultValues:{
      image: "",
    }
  })

  function onSubmitAV(values: z.infer<typeof formSchemaAV>){
    console.log(values)
  }


  return (
    <>
    <div className = "flex p-12 ">
    <div>
    <AvatarChange/>
    <Form {...formAV}>
      <form onSubmit={formAV.handleSubmit(onSubmitAV)} className="space-y-0 mb-4">
      <FormField
          control={formAV.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Change Image</FormLabel>
              <FormControl>
                <Input
                placeholder="Image URL"
                type = "url"
                {...field} />
              </FormControl>
              <FormDescription>
                Input the url of your new image
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
    </div>
    <div className = "flex-1 p-10">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0 mb-4">
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
      <form onSubmit={formEM.handleSubmit(onSubmitEM)} className="space-y-0 mb-4">
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
      <form onSubmit={formPW.handleSubmit(onSubmitPW)}>
      <FormField
          control={formPW.control}
          name="passwordPrev"
          render={({ field }) => (
            <FormItem className="mb-2">
              <FormLabel>Change Password</FormLabel>
              <FormControl>
                <Input
                placeholder="Current Password"
                type = "password"
                {...field} />
              </FormControl>
              <FormDescription>
                Your current password
              </FormDescription>
              <FormMessage />
            </FormItem>
        )}
      />
      <FormField
          control={formPW.control}
          name="password"
          render={({ field }) => (
            <FormItem className="mb-2">
              <FormControl>
                <Input
                placeholder="Password"
                type = "password"
                {...field} />
              </FormControl>
              <FormDescription>
                Your new password
              </FormDescription>
              <FormMessage />
            </FormItem>
        )}
      />
      <FormField
          control={formPW.control}
          name="passwordConfirm"
          render={({ field }) => (
            <FormItem >
              <FormControl>
                <Input
                placeholder="Password Confirm"
                type = "password"
                {...field} />
              </FormControl>
              <FormDescription>
                  Your current password
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
