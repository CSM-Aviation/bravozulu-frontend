import ProtectedRoute from '../components/ProtectedRoute';
import Dashboard from '../components/DashboardPage';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}