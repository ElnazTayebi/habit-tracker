import Input from "../ui/Input";
import Button from "../ui/Button";
import Label from "../ui/Label";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { auth } from "../../firebase"

// validation
import { validateEmail } from "../../validations/auth.validation";

// Zustand
import { useAuthStore } from "../../store/auth/authStore";

const LoginForm = () => {
    const [showPassword, setShowPassword] = useState(false);

    // 🧾 form state
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // ⚠️ error state (same structure as signup)
    const [errors, setErrors] = useState({
        email: "",
        password: "",
    });

    // Zustand
    const login = useAuthStore((state) => state.login);
    const loading = useAuthStore((state) => state.loading);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors = {
            email: "",
            password: "",
        };

        let hasError = false;

        // 📧 Email validation (empty → format)
        if (!email) {
            newErrors.email = "Email is required";
            hasError = true;
        } else if (!validateEmail(email)) {
            newErrors.email = "Invalid email format";
            hasError = true;
        }

        // 🔒 Password validation
        if (!password) {
            newErrors.password = "Password is required";
            hasError = true;
        }

        setErrors(newErrors);

        if (hasError) return;

        try {
            // 🔥 Zustand login
            await login(email, password);

            console.log("Login successful");
            const user = auth.currentUser;  // auth import firebase.ts
            if (user) {
                console.log("Current user from Firebase:", user);
            } else {
                console.log("No user logged in");
            }

        } catch (err: any) {
            // ❌ map Firebase errors to fields (consistent UX)
            if (err.code === "auth/user-not-found") {
                setErrors((prev) => ({
                    ...prev,
                    email: "User not found",
                }));
            } else if (err.code === "auth/wrong-password") {
                setErrors((prev) => ({
                    ...prev,
                    password: "Wrong password",
                }));
            } else {
                setErrors((prev) => ({
                    ...prev,
                    email: "Something went wrong",
                }));
            }
        }
    };

    return (
        <div className="w-full max-w-sm space-y-6 p-6 bg-[rgb(var(--card))] rounded-xl shadow">

            {/* Logo */}
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center">
                    ✔
                </div>
                <span className="font-semibold text-lg">HabitTrack</span>
            </div>

            <h2 className="mt-6 text-xl">
                Sign in to your account
            </h2>

            {/* ❌ disable browser validation */}
            <form noValidate className="space-y-4" onSubmit={handleLogin}>

                {/* 📧 Email */}
                <div>
                    <Label htmlFor="email">Email address</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => {
                            const value = e.target.value;
                            setEmail(value);

                            // 🔍 real-time validation
                            setErrors((prev) => ({
                                ...prev,
                                email: !value
                                    ? "Email is required"
                                    : validateEmail(value)
                                        ? ""
                                        : "Invalid email format",
                            }));
                        }}
                        className="w-full p-2 rounded bg-[rgb(var(--card-muted))]"
                    />

                    {errors.email && (
                        <p className="text-sm text-red-500 mt-1">
                            {errors.email}
                        </p>
                    )}
                </div>

                {/* 🔒 Password */}
                <div>
                    <div className="flex justify-between">
                        <Label htmlFor="password">Password</Label>

                        <a
                            href="#"
                            className="text-sm text-[rgb(var(--primary))]"
                        >
                            Forgot password?
                        </a>
                    </div>

                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="******"
                            value={password}
                            onChange={(e) => {
                                const value = e.target.value;
                                setPassword(value);

                                setErrors((prev) => ({
                                    ...prev,
                                    password: !value ? "Password is required" : "",
                                }));
                            }}
                            className="w-full p-2 rounded bg-[rgb(var(--card-muted))]"
                        />

                        {/* 👁️ toggle */}
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {errors.password && (
                        <p className="text-sm text-red-500 mt-1">
                            {errors.password}
                        </p>
                    )}
                </div>

                {/* 🚀 Submit */}
                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full"
                >
                    {loading ? "Loading..." : "Sign in"}
                </Button>
            </form>

            {/* Footer */}
            <p className="text-left text-sm text-[rgb(var(--muted))]">
                Not a member?{" "}
                <Link
                    to="/signup"
                    className="ml-1 text-[rgb(var(--primary))] font-semibold"
                >
                    Create account
                </Link>
            </p>
        </div>
    );
};

export default LoginForm;