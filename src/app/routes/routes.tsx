import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './protected-route';
import { LoginPage } from '../../features/auth';
import DashboardPage from '../../features/dashboard/pages/dashboard-page';
import ForgetPasswordPage from '../../features/auth/pages/forget-password';
import ResetPasswordPage from '../../features/auth/pages/reset-password';
import VerifiedPage from '../../features/auth/pages/verified';
import NotFound from '../../shared/pages/not-found';
import SettingsPage from '../../features/dashboard/pages/settings-page';
import DashboardLayout from '../../shared/layouts/dashboard-layout';
import ProfilePage from '../../features/profile/pages/profile-page';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute isAnonymousRequired={true} />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forget-password" element={<ForgetPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verified" element={<VerifiedPage />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

