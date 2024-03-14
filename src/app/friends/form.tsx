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

const formSchema = z.object({
    username: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
  });

export function FriendForm(){


      //username of friend
      const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          username: "",
        },
      })
    
      async function onSubmit(values: z.infer<typeof formSchema>) {
          const response = await fetch('/api/newFriend', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  newFriend: values.username
              }),
          }).then((res) => {
              if (res.ok) {
                  console.error('Added Friend');
              } else {
                  console.error("Couldn't Add Friend");
              }
          });
      }

      return (
        <>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0 mb-4">
      <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Add Friend</FormLabel>
              <FormControl>
                <Input
                placeholder="Friend's Username"
                type = "username"
                {...field} />
              </FormControl>
              <FormDescription>
                Input your friend&apos;s username.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
    </>
      )

}


