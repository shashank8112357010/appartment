import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import Notifications from "./pages/Notifications";
import Maintenance from "./pages/Maintenance";
import Electricity from "./pages/Electricity";
import Salary from "./pages/Salary";
import Deposit from "./pages/Deposit";
import Cleaning from "./pages/Cleaning";
import Other from "./pages/Other";
import BudgetManager from "./pages/BudgetManager";
import NotFound from "./pages/NotFound";

import Chat from "@/pages/Chat";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    {/* <TooltipProvider> */}
    {/* <Toaster /> */}
    {/* <Sonner /> */}
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Admin Routes - Only accessible by admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/maintenance"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Maintenance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/electricity"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Electricity />
            </ProtectedRoute>
          }
        />
        <Route
          path="/salary"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Salary />
            </ProtectedRoute>
          }
        />
        <Route
          path="/deposit"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Deposit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cleaning"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Cleaning />
            </ProtectedRoute>
          }
        />
        <Route
          path="/other"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Other />
            </ProtectedRoute>
          }
        />
        <Route
          path="/budget"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <BudgetManager />
            </ProtectedRoute>
          }
        />

        {/* Owner Routes - Only accessible by owners */}
        <Route
          path="/owner"
          element={
            <ProtectedRoute allowedRoles={['owner']}>
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Shared Routes - Accessible by both admin and owner */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute allowedRoles={['admin', 'owner']}>
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute allowedRoles={['admin', 'owner']}>
              <Notifications />
            </ProtectedRoute>
          }
        />

        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
    {/* </TooltipProvider> */}
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
