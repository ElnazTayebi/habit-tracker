import { Route, Routes } from "react-router-dom";
import LoginPage from "../pages/login/LoginPage";
import MainLayout from "../layouts/MainLayout";
import SignupPage from "../pages/signup/SignupPage";

const Router = () => {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<div>Home</div>} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
            </Route>
        </Routes>
    )
}
export default Router;