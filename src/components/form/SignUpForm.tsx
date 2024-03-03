'use client';

import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/Components/ui/form";
import {useForm} from "react-hook-form";
import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/Components/ui/input";
import {Button} from "@/Components/ui/button";
import Link from "next/link";

interface UserData {
    username: string;
    email: string;
    profilePicture: string;
    password: string;
}

const FormSchema = z
    .object({
    username: z.string().min(1, 'Username is required').max(100, 'Username cannot exceed 100 characters'),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    profilePicture: z.string().url('Invalid URL').optional(),
    password: z.string().min(1, 'Password is required').min(8, 'Password must have at least 8 characters'),
    confirmPassword: z.string().min(1, 'Password confirmation is required')
    })
    .refine((data) => data.password === data.confirmPassword, {
        path:['confirmPassword'],
        message: 'Passwords do not match',
    });

const SignUpForm = () => {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username:'',
            email: '',
            profilePicture: undefined,
            password: '',
            confirmPassword: ''
        },
    })

    const onSubmit = (values: z.infer<typeof FormSchema>) => {
        console.log(values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='w-full'>
                <div className='space-y-2'>
                    <FormField
                        control={form.control}
                        name='username'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel><FormLabel className='text-red-700'>*</FormLabel>
                                <FormControl>
                                    <Input placeholder='johndoe' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='email'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel><FormLabel className='text-red-700'>*</FormLabel>
                                <FormControl>
                                    {/*can add type='email'*/}
                                    <Input placeholder="johndoe@example.com"{...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='profilePicture'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Profile Picture</FormLabel>
                                <FormControl>
                                    {/*can add type='url'*/}
                                    <Input placeholder="Upload image URL" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='password'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel><FormLabel className='text-red-700'>*</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your password" type='password' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='confirmPassword'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm Password</FormLabel><FormLabel className='text-red-700'>*</FormLabel>
                                <FormControl>
                                    <Input placeholder="Re-enter your password" type='password' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button className='w-full mt-6' type="submit">Sign up</Button>
            </form>
            <div className='mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400'>
                or
            </div>
            <p className='text-center text-sm text-gray-600 mt-2'>
                If you already have an account, please&nbsp;
                <Link className='text-blue-500 hover:underline' href='sign-in'>Sign in</Link>
                .
            </p>
        </Form>
    );
};

export default SignUpForm;