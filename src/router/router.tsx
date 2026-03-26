import { Route, Routes } from "react-router-dom";
import LoginPage from "../pages/login/LoginPage";
import MainLayout from "../layouts/MainLayout";
import SignupPage from "../pages/signup/SignupPage";
import SignOutPage from "../pages/signout/SignoutPage";
import AddHabitPage from "../pages/habits/AddHabitPage";



const Router = () => {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<div>Home</div>} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/logout" element={<SignOutPage />} />
                <Route path="/add-habit" element={<AddHabitPage />} />
            </Route>
        </Routes>
    )
}
export default Router;