import { JSX } from "react";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { LoginForm } from "../../parts/auth/LoginForm";
import Home from "../../parts/home/Home";
import { authSelector } from "../recoil/common/auth/authRecoil";
import { NovrisRoutes } from "./routes";

/**
 * 認証保護ルートコンポーネント
 * @author nonsugertea7821
 * @returns JSX.Element
 */
function ProtectedRoute(): JSX.Element {
    const { isAuthenticated } = useRecoilValue(authSelector);
    return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

/**
 * アプリルーターコンポーネント
 * @author nonsugertea7821
 * @returns JSX.Element
 */
export default function AppRouter(): JSX.Element {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginForm />} />
                <Route element={<ProtectedRoute />}>
                    {/**要認証AP */}
                    <Route path={NovrisRoutes.AP_MC_NOVRIS_HOME.path} element={<Home />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}