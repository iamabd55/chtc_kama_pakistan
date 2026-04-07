"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminDb } from "@/lib/supabase/adminClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";
import { Eye, EyeOff, Lock } from "lucide-react";

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !password.trim()) return;

        setLoading(true);
        const { error } = await adminDb.auth.signInWithPassword({
            email,
            password,
        });
        setLoading(false);

        if (error) {
            toast({
                title: "Login Failed",
                description: error.message,
                variant: "destructive",
            });
        } else {
            router.push("/admin/dashboard");
        }
    };

    return (
        <div className="min-h-screen lg:min-h-[111.12vh] flex items-center justify-center bg-kama-gradient relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E")`,
                    }}
                />
            </div>

            <div className="relative w-full max-w-md mx-4">
                <div className="bg-card rounded-2xl shadow-2xl border p-8 md:p-10">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <Image
                            src="/images/al-nasir-logo.png"
                            alt="Al Nasir Motors Pakistan"
                            width={120}
                            height={56}
                            className="h-14 w-auto mx-auto mb-4"
                        />
                        <h1 className="font-display text-2xl font-bold text-foreground">
                            Admin Panel
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Sign in to manage your website
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="text-sm font-medium text-foreground mb-1.5 block">
                                Email Address
                            </label>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@alnasirmotors.com.pk"
                                required
                                className="h-11"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-foreground mb-1.5 block">
                                Password
                            </label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="h-11 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 font-display font-semibold text-base"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground" />
                            ) : (
                                <>
                                    <Lock className="w-4 h-4 mr-2" />
                                    Sign In
                                </>
                            )}
                        </Button>
                    </form>

                    <p className="text-xs text-center text-muted-foreground mt-6">
                        Al Nasir Motors Pakistan — Internal Use Only
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;

