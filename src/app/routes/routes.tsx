import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
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
import TicketsPage from '../../features/tickets/pages/tickets-page';
import NewTicketPage from '../../features/tickets/pages/new-ticket';
import EditTicketPage from '../../features/tickets/pages/edit-ticket';
import ViewTicketPage from '../../features/tickets/pages/view-ticket';
import RecycleBinPage from '../../features/tickets/pages/recycle-bin';
import ViewRecycleTicket from '../../features/tickets/pages/view-recycle-ticket';
import ManagersPage from '../../features/users/pages/managers';
import NewManagerPage from '../../features/users/pages/new-manager';
import EditManagerPage from '../../features/users/pages/edit-manager';
import ViewManagerPage from '../../features/users/pages/view-manager';
import EmployeesPage from '../../features/users/pages/employees';
import EditEmployeePage from '../../features/users/pages/edit-employee';
import NewEmployeePage from '../../features/users/pages/new-employee';
import ViewEmployeePage from '../../features/users/pages/view-employee';
import PlansPage from '../../features/plans/pages/plans';
import HelpPage from '../../features/dashboard/pages/help-page';
import NotificationsPage from '../../features/notifications/pages/notifications';
import ChatsPage from '../../features/chats/pages/chats';
import OwnerRoutes from './owner-routes';
import OwnerManagerRoutes from './manager-routes';
import MarginLayout from '../../shared/layouts/dashboard-margin-layout';

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
            <Route element={<MarginLayout />}>
              <Route path="/" element={<Navigate to={'/dashboard'} />} />
              <Route path="/dashboard" element={<DashboardPage />} />

              <Route path="/tickets" element={<TicketsPage />} />
              <Route path="/tickets/new" element={<NewTicketPage />} />
              <Route path="/tickets/:id" element={<ViewTicketPage />} />
              <Route path="/tickets/:id/edit" element={<EditTicketPage />} />

              <Route element={<OwnerManagerRoutes />}>
                <Route path="/employees" element={<EmployeesPage />} />
                <Route path="/employees/new" element={<NewEmployeePage />} />
                <Route path="/employees/:id" element={<ViewEmployeePage />} />
                <Route
                  path="/employees/:id/edit"
                  element={<EditEmployeePage />}
                />

                <Route path="/recycle-bin" element={<RecycleBinPage />} />
                <Route
                  path="/recycle-bin/:id"
                  element={<ViewRecycleTicket />}
                />
              </Route>

              <Route path="/notifications" element={<NotificationsPage />} />

              <Route element={<OwnerRoutes />}>
                <Route path="/plans" element={<PlansPage />} />
                <Route path="/managers" element={<ManagersPage />} />
                <Route path="/managers/new" element={<NewManagerPage />} />
                <Route path="/managers/:id" element={<ViewManagerPage />} />
                <Route
                  path="/managers/:id/edit"
                  element={<EditManagerPage />}
                />
              </Route>
              <Route path="/help" element={<HelpPage />} />

              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
            <Route path="/chats" element={<ChatsPage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

