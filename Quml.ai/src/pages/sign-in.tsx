'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Link from "next/link"
import * as z from 'zod'
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { signinSchema } from "@/ZodSchema/signinSchema"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { signIn } from "next-auth/react"

const Page = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { toast } = useToast();
    const router = useRouter();

    // Zod implementation schema checking
    const form = useForm<z.infer<typeof signinSchema>>({
        resolver: zodResolver(signinSchema),
        defaultValues: {
            identifier: "",
            password: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof signinSchema>) => {
        setIsSubmitting(true); // Set submitting to true
    
        try {
            // Use NextAuth for authentication
            const result = await signIn('credentials', {
                redirect: false,
                identifier: data.identifier,
                password: data.password,
            });
    
            if (result?.error) {
                if (result.error === 'CredentialsSignIn') {
                    toast({
                        title: "Login failed",
                        description: "Incorrect email/fullName or password",
                        variant: "destructive"
                    });
                } else {
                    toast({
                        title: "Login failed",
                        description: result.error,
                        variant: "destructive"
                    });
                }
            } else if (result?.url) {
                console.log(`Successful login, redirecting to: ${result.url}`);
                router.replace('/digital-marketing'); // This will redirect to the URL returned by NextAuth
            }
        } catch (error) {
            console.error("Sign-in error:", error);
            toast({
                title: "An error occurred",
                description: "Something went wrong. Please try again later.",
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false); // Set submitting to false after the process completes
        }
    }
    

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-400 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <h1 className="text-4xl font-extrabold tracking-tight text-center lg:text-5xl mb-6">
                    Join Quml Application
                </h1>
                <p className="mb-4 text-center">Sign in to start your Journery</p>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="identifier"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email/fullName</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="email/fullName"
                                            {...field}
                                        />
                                    </FormControl>
                                    {/* <FormDescription>
                                        You Entered Username.
                                    </FormDescription> */}
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
                                        <Input
                                            type="password"
                                            placeholder="password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        You Entered Password.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                                </>
                            ) : ('Sign In')}
                        </Button>
                    </form>
                </Form>

                <div className="text-center">
                    <p>
                        Don't have an account?{' '}
                        <Link href={'/sign-up'} className="text-blue-500 hover:text-blue-800">Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Page;