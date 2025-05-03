import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Redirect } from "wouter";
import { Loader2 } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { useAuth } from "@/hooks/use-auth";
import { loginSchema, insertUserSchema } from "@shared/schema";
import Header from "@/components/layouts/Header";

// Add password confirmation to the register schema
const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const { user, loginMutation, registerMutation, googleLoginMutation } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("login");
  
  // Google sign-in function
  function handleGoogleSignIn() {
    // In a real implementation, this would redirect to Google OAuth
    // For now we'll simulate a login with sample data
    googleLoginMutation.mutate({
      googleId: "google-" + Math.random().toString(36).substring(2, 15),
      email: "user" + Math.floor(Math.random() * 1000) + "@example.com",
      username: "user" + Math.floor(Math.random() * 1000),
      avatarUrl: "https://ui-avatars.com/api/?name=Test+User"
    });
  }

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onLoginSubmit(data: LoginFormValues) {
    loginMutation.mutate(data);
  }

  function onRegisterSubmit(data: RegisterFormValues) {
    const { confirmPassword, ...userData } = data;
    registerMutation.mutate(userData);
  }

  // Redirect to dashboard if already logged in
  if (user) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-primary">
      <Header />
      <div className="flex-1 relative py-24">
        {/* Background glow effect */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.15)_0%,_transparent_70%)]"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Left side - Auth forms */}
            <div className="bg-primary-800/80 backdrop-blur-sm rounded-2xl p-8 border border-muted/50 shadow-xl">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-accent-cyan rounded-full blur-sm opacity-40"></div>
                  <div className="relative bg-secondary rounded-full p-2.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-accent-cyan h-8 w-8"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
                    </svg>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>

                {/* Login Tab */}
                <TabsContent value="login">
                  <div className="space-y-4">
                    <div className="text-center mb-6">
                      <h2 className="font-poppins font-bold text-2xl text-foreground">
                        Welcome back
                      </h2>
                      <p className="text-muted-foreground mt-1">
                        Log in to access your secure cloud storage
                      </p>
                    </div>

                    <div className="space-y-4">
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={googleLoginMutation?.isPending || loginMutation.isPending}
                      >
                        {googleLoginMutation?.isPending ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Connecting...
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                              <path
                                fill="currentColor"
                                d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10c5.35 0 9.25-3.67 9.25-9.09c0-1.15-.15-1.81-.15-1.81Z"
                              />
                            </svg>
                            Continue with Google
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="flex items-center my-6">
                      <Separator className="flex-1" />
                      <span className="px-3 text-sm text-muted-foreground">or</span>
                      <Separator className="flex-1" />
                    </div>

                    <Form {...loginForm}>
                      <form
                        onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                        className="space-y-4"
                      >
                        <FormField
                          control={loginForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-muted-foreground">Email</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="you@example.com"
                                  className="glow-border bg-primary-900/60 border-muted/50"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={loginForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex justify-between items-center">
                                <FormLabel className="text-muted-foreground">Password</FormLabel>
                                <a href="#" className="text-sm text-accent-cyan hover:underline">
                                  Forgot password?
                                </a>
                              </div>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="••••••••"
                                  className="glow-border bg-primary-900/60 border-muted/50"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          className="w-full ripple hover-glow bg-accent-blue"
                          disabled={loginMutation.isPending}
                        >
                          {loginMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Logging in...
                            </>
                          ) : (
                            "Log in"
                          )}
                        </Button>
                      </form>
                    </Form>

                    <p className="text-center text-sm text-muted-foreground mt-6">
                      Don't have an account?{" "}
                      <button
                        className="text-accent-cyan hover:underline"
                        onClick={() => setActiveTab("register")}
                      >
                        Sign up
                      </button>
                    </p>
                  </div>
                </TabsContent>

                {/* Register Tab */}
                <TabsContent value="register">
                  <div className="space-y-4">
                    <div className="text-center mb-6">
                      <h2 className="font-poppins font-bold text-2xl text-foreground">
                        Create your account
                      </h2>
                      <p className="text-muted-foreground mt-1">
                        Sign up to start using Vaultigo cloud storage
                      </p>
                    </div>

                    <div className="space-y-4">
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={googleLoginMutation?.isPending || registerMutation.isPending}
                      >
                        {googleLoginMutation?.isPending ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Connecting...
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                              <path
                                fill="currentColor"
                                d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10c5.35 0 9.25-3.67 9.25-9.09c0-1.15-.15-1.81-.15-1.81Z"
                              />
                            </svg>
                            Continue with Google
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="flex items-center my-6">
                      <Separator className="flex-1" />
                      <span className="px-3 text-sm text-muted-foreground">or</span>
                      <Separator className="flex-1" />
                    </div>

                    <Form {...registerForm}>
                      <form
                        onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                        className="space-y-4"
                      >
                        <FormField
                          control={registerForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-muted-foreground">Username</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="johndoe"
                                  className="glow-border bg-primary-900/60 border-muted/50"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={registerForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-muted-foreground">Email</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="you@example.com"
                                  className="glow-border bg-primary-900/60 border-muted/50"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={registerForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-muted-foreground">Password</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="••••••••"
                                  className="glow-border bg-primary-900/60 border-muted/50"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={registerForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-muted-foreground">
                                Confirm Password
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="••••••••"
                                  className="glow-border bg-primary-900/60 border-muted/50"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          className="w-full ripple hover-glow bg-accent-blue"
                          disabled={registerMutation.isPending}
                        >
                          {registerMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Creating account...
                            </>
                          ) : (
                            "Create account"
                          )}
                        </Button>
                      </form>
                    </Form>

                    <p className="text-center text-sm text-muted-foreground mt-6">
                      Already have an account?{" "}
                      <button
                        className="text-accent-cyan hover:underline"
                        onClick={() => setActiveTab("login")}
                      >
                        Log in
                      </button>
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right side - Hero content */}
            <div className="text-white space-y-6 p-6">
              <h1 className="font-poppins font-bold text-4xl md:text-5xl text-white leading-tight">
                Secure your data in the{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-blue animate-gradient">
                  digital cloud
                </span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Vaultigo provides military-grade encryption, lightning-fast speeds, and
                intelligent AI organization for all your files.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <div className="flex items-start space-x-3">
                  <div className="rounded-full bg-accent-blue/20 p-2 mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-accent-cyan h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-white">End-to-end encryption</h3>
                    <p className="text-sm text-muted-foreground">
                      Your files are protected with advanced encryption standards at rest
                      and in transit.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="rounded-full bg-accent-blue/20 p-2 mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-accent-cyan h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m9 14 6-6" />
                      <circle cx="9" cy="14" r="2" />
                      <circle cx="15" cy="8" r="2" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-white">AI-powered organization</h3>
                    <p className="text-sm text-muted-foreground">
                      Intelligent file organization and search powered by multiple AI models.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="rounded-full bg-accent-blue/20 p-2 mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-accent-cyan h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m8 14-4 4 4 4" />
                      <path d="M4 18h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v10" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-white">External integrations</h3>
                    <p className="text-sm text-muted-foreground">
                      Connect to external cloud services like Dropbox, OneDrive and more.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="rounded-full bg-accent-blue/20 p-2 mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-accent-cyan h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0
                      0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-white">Simple controls</h3>
                    <p className="text-sm text-muted-foreground">
                      Intuitive interface designed for both novice and advanced users.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}