import { Route, Routes } from "react-router-dom";
import LoginPage from "../pages/login/LoginPage";
import MainLayout from "../layouts/MainLayout";

const Router = () => {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<div>Home</div>} />
                <Route path="/login" element={<LoginPage />} />
            </Route>
        </Routes>
    )
}
export default Router;