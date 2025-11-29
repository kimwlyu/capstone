// src/App.tsx
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "@/pages/LoginPage";
import { Dashboard } from "@/pages/Dashboard";
import { RiskAlarms } from "@/pages/RiskAlarms";
import { AlarmDetailPage } from "@/pages/AlarmDetailPage";
import { UserList } from "@/pages/UserList";
import { UserDetailPage } from "@/pages/UserDetailPage";

const RequireAuth = ({ children }: { children: JSX.Element }) => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

export const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route
                    path="/"
                    element={
                        <RequireAuth>
                            <Dashboard />
                        </RequireAuth>
                    }
                />
                <Route
                    path="/risk-alarms"
                    element={
                        <RequireAuth>
                            <RiskAlarms />
                        </RequireAuth>
                    }
                />
                <Route
                    path="/risk-alarms/:alarmId"
                    element={
                        <RequireAuth>
                            <AlarmDetailPage />
                        </RequireAuth>
                    }
                />
                <Route
                    path="/users"
                    element={
                        <RequireAuth>
                            <UserList />
                        </RequireAuth>
                    }
                />
                <Route
                    path="/users/:userId"
                    element={
                        <RequireAuth>
                            <UserDetailPage />
                        </RequireAuth>
                    }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
};
