import Input from "../ui/Input";
import Button from "../ui/Button";
import Label from "../ui/Label";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";


const LoginForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className="w-full max-w-sm space-y-6 p-6 bg-[rgb(var(--card))] rounded-xl shadow">
            {/*  Logo */}
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center">
                    ✔
                </div>
                <span className="font-semibold text-lg">HabitTrack</span>

            </div>
            <h2 className="mt-6 text-xl font-bold">
                Sign in to your account
            </h2>
            {/* Form */}
            <form className="space-y-4">
                <div>
                    <Label htmlFor="email">Email adress</Label>
                    <Input
                        className="w-full p-2 rounded bg-[rgb(var(--card-muted))] text-[rgb(var(--text))]"
                        id="email" type="email" placeholder="Enter email" />
                </div>
                {/*  Password */}
                <div>
                    <div className="flex justify-between">
                        <Label htmlFor="password">Password</Label>

                        <a href="#"
                            className="text-sm text-[rgb(var(--primary))] hover:opacity-80"
                        >
                            Forgot password?
                        </a>
                    </div>
                    <div className="relative">
                        <Input
                            className="w-full p-2 rounded bg-[rgb(var(--card-muted))] text-[rgb(var(--text))]"
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="******"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(prev => !prev)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-[rgb(var(--primary))]"
                        >
                            {showPassword ? (<EyeOff size={18} />) : (<Eye size={18} />)}
                        </button>
                    </div>
                </div>
                {/*   Button */}
                <Button
                    className="w-full bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))] p-2 rounded"
                    type="submit">Sign in</Button>
            </form>

            {/* Footer */}
            <p className="text-center text-sm text-[rgb(var(--muted))]">
                Not a member?{""}
                <a
                    href="#"
                    className="text-[rgb(var(--primary))] font-medium">
                    Start free trial
                </a>
            </p>
        </div>
    )
}
export default LoginForm;