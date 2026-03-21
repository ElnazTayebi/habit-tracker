import Input from "../ui/Input";
import Button from "../ui/Button";
import Label from "../ui/Label";


const LoginForm = () => {
    return (
        <div className="w-full max-w-sm space-y-6">
            {/*  Logo */}
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center">
                    ✔
                </div>
                <span className="font-semibold text-lg">HabitTrack</span>
                <h2 className="mt-6 text-txl font-bold">
                    Sign in to your account
                </h2>
            </div>
            {/* Form */}
            <form className="space-y-4">
                <div>
                    <Label htmlFor="email">Email adress</Label>
                    <Input id="email" type="email" placeholder="Enter email" />
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
                <Input id="password" type="password" placeholder="******" />
               </div>
             {/*   Button */}
             <Button type="submit">Sign in</Button>
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