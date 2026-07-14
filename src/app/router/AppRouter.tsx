import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { PATHS } from "./paths";
import { useAppSelector } from "@/app/store/hooks";
import MainLayout from "@/components/layouts/MainLayout";

import LoginPage from "@/features/auth/pages/LoginPage";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import PurchasePage from "@/features/purchase/pages/PurchasePage";
import SalesPage from "@/features/sales/pages/SalesPage";
import ExpensesPage from "@/features/expenses/pages/ExpensesPage";
import InventoryPage from "@/features/inventory/pages/InventoryPage";
import LabourPage from "@/features/labour/pages/LabourPage";
import NotificationPage from "@/features/notifications/pages/NotificationPage";
import PartyPage from "@/features/party/pages/PartyPage";
import PartnersPage from "@/features/partners/pages/PartnersPage";

import NotFound from "@/components/feedback/NotFound";

// Auth Protected Routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  return isAuthenticated ? <>{children}</> : <Navigate to={PATHS.LOGIN} replace />;
};

// Public Routes (Redirect to Dashboard if logged in)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  return !isAuthenticated ? <>{children}</> : <Navigate to={PATHS.DASHBOARD} replace />;
};

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={PATHS.ROOT}
          element={<Navigate to={PATHS.LOGIN} replace />}
        />

        <Route
          path={PATHS.LOGIN}
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        {/* Protected Dashboard Features */}
        <Route
          path={PATHS.DASHBOARD}
          element={
            <ProtectedRoute>
              <MainLayout>
                <DashboardPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path={PATHS.PURCHASE}
          element={
            <ProtectedRoute>
              <MainLayout>
                <PurchasePage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path={PATHS.SALES}
          element={
            <ProtectedRoute>
              <MainLayout>
                <SalesPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path={PATHS.EXPENSES}
          element={
            <ProtectedRoute>
              <MainLayout>
                <ExpensesPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path={PATHS.INVENTORY}
          element={
            <ProtectedRoute>
              <MainLayout>
                <InventoryPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path={PATHS.LABOUR}
          element={
            <ProtectedRoute>
              <MainLayout>
                <LabourPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path={PATHS.NOTIFICATIONS}
          element={
            <ProtectedRoute>
              <MainLayout>
                <NotificationPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path={PATHS.PARTNERS}
          element={
            <ProtectedRoute>
              <MainLayout>
                <PartnersPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path={PATHS.PARTY}
          element={
            <ProtectedRoute>
              <MainLayout>
                <PartyPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;