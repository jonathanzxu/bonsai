"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

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
import {getSession, signOut} from 'next-auth/react';

import * as AvatarPrimative from '@radix-ui/react-avatar';
import {useEffect, useState} from "react";

function AvatarChange(){
    const [user, setUser] = useState(undefined);
    useEffect(() => {
        getSession().then((user) => {
            if (user) {
                setUser((user as any).user);
            }
        });
    }, []);
    const defaultImage = "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80";
    const imageSrc = user?.picture || defaultImage;
    const altText = user?.username || "No username";

    return (
        <AvatarPrimative.Root className="AvatarRoot h-500 w-500" style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <AvatarPrimative.Image
                className="AvatarImage"
                src={imageSrc}
                alt={altText}
                style={{maxHeight: '500px', maxWidth: '500px'}}
            />
            <div className="Username" style={{fontWeight: 'bold', marginTop: '10px'}}>{altText}</div>
        </AvatarPrimative.Root>
    )

}

function DeleteAccountButton() {
    const handleDeleteAccount = async () => {
        const response = await fetch('/api/delete-account', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((res) => {
            if (res.ok) {
                console.error('Deleted user');
                signOut({ callbackUrl: '/login' });
            } else {
                console.error('Could not delete user');
            }
        });
    };


    return (
        <Button>
            <AlertDialog>
                <AlertDialogTrigger>Delete Account</AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove your data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteAccount}>Delete account</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Button>
    );
}


const formSchema = z.object({
  username: z.string().min(6, {
    message: "Username must be at least 6 characters.",
  }),
});

const formSchemaEM = z.object({
  email: z.string().email()
});

const formSchemaPW = z
.object({
  passwordPrev: z.string(),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
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
              newUsername: values.username
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

  async function onSubmitEM(values: z.infer<typeof formSchemaEM>) {
      const response = await fetch('/api/change-email', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              newEmail: values.email
          }),
      }).then((res) => {
          if (res.ok) {
              console.error('Changed email');
          } else {
              console.error('Could not change email');
          }
      });
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

  async function onSubmitPW(values: z.infer<typeof formSchemaPW>){
      const response = await fetch('/api/change-password', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              oldPassword: values.passwordPrev,
              newPassword: values.password
          }),
      }).then((res) => {
          if (res.ok) {
              console.error('Changed password');
          } else {
              console.error('Could not change password');
          }
      });
  }

  //Avatar
  const formAV = useForm<z.infer<typeof formSchemaAV>>({
    resolver: zodResolver(formSchemaAV),
    defaultValues:{
      image: "",
    }
  })

  async function onSubmitAV(values: z.infer<typeof formSchemaAV>){
      const response = await fetch('/api/change-profile-picture', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              newPicture: values.image
          }),
      }).then((res) => {
          if (res.ok) {
              console.error('Changed picture');
          } else {
              console.error('Could not change picture');
          }
      });
  }


  return (
    <>
    <div className = "flex p-12 ">
    <div>
    <AvatarChange/>
    <Form {...formAV}>
      <form onSubmit={formAV.handleSubmit(onSubmitAV)} className="space-y-3 mb-4">
      <FormField
          control={formAV.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Change Image</FormLabel>
              <FormControl>
                <Input
                placeholder="Input the url of your new image"
                type = "url"
                {...field} />
              </FormControl>
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 mb-4">
      <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Change Username</FormLabel>
              <FormControl>
                <Input
                placeholder="This is your public display name."
                type = "username"
                {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
    <Form {...formEM}>
      <form onSubmit={formEM.handleSubmit(onSubmitEM)} className="space-y-3 mb-4">
      <FormField
          control={formEM.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Change Email Address</FormLabel>
              <FormControl>
                <Input
                placeholder="Your account email"
                type = "email"
                {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
    <Form {...formPW}>
      <form onSubmit={formPW.handleSubmit(onSubmitPW)} className="space-y-3 mb-4">
      <FormField
          control={formPW.control}
          name="passwordPrev"
          render={({ field }) => (
            <FormItem className="mb-2">
              <FormLabel>Change Password</FormLabel>
              <FormControl>
                <Input
                placeholder="Your current password"
                type = "password"
                {...field} />
              </FormControl>
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
                placeholder="Your new password"
                type = "password"
                {...field} />
              </FormControl>
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
                placeholder="Confirm new password"
                type = "password"
                {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
        )}
      />
          <Button type="submit" style={{ marginBottom: '25px' }}>Submit</Button>
      </form>
        <DeleteAccountButton></DeleteAccountButton>
    </Form>
    </div>
    </div>
    </>
  )
}
