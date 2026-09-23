import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuthStore } from '@/stores/authStore';

// Lazy loading de todas las páginas
const LandingPage = lazy(() => import('@/pages/public/LandingPage'));
const LoginPage = lazy(() => import('@/pages/public/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/public/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/public/ForgotPasswordPage'));

const HomePage = lazy(() => import('@/pages/app/HomePage'));
const MapPage = lazy(() => import('@/pages/app/MapPage'));
const WorldsPage = lazy(() => import('@/pages/app/WorldsPage'));
const CoursePage = lazy(() => import('@/pages/app/CoursePage'));
const LessonPage = lazy(() => import('@/pages/app/LessonPage'));
const ProfilePage = lazy(() => import('@/pages/app/ProfilePage'));
const AchievementsPage = lazy(() => import('@/pages/app/AchievementsPage'));
const PlusPage = lazy(() => import('@/pages/app/PlusPage'));
const LeaderboardPage = lazy(() => import('@/pages/app/LeaderboardPage'));
const SettingsPage = lazy(() => import('@/pages/app/SettingsPage'));
const TrainingPage = lazy(() => import('@/pages/app/TrainingPage'));
const CodeLabPage = lazy(() => import('@/pages/app/CodeLabPage'));

const AdminLayout = lazy(() => import('@/pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));

const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const OnboardingPage = lazy(() => import('@/pages/app/OnboardingPage'));

// Componente de loading
function PageLoader() {
  return (
    <div className="min-h-screen bg-[--bg-base] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-[--text-secondary]">Byte está preparando tu misión...</p>
      </div>
    </div>
  );
}

// Guard de rutas protegidas
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthStore();

  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

// Guard de rutas admin
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { profile, loading } = useAuthStore();

  if (loading) return <PageLoader />;
  if (!profile || profile.role !== 'admin') return <Navigate to="/app/home" replace />;
  return <>{children}</>;
}

const router = createBrowserRouter([
  // === RUTAS PÚBLICAS ===
  {
    path: '/',
    element: (
      <Suspense fallback={<PageLoader />}>
        <LandingPage />
      </Suspense>
    ),
  },
  {
    path: '/login',
    element: (
      <Suspense fallback={<PageLoader />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: '/register',
    element: (
      <Suspense fallback={<PageLoader />}>
        <RegisterPage />
      </Suspense>
    ),
  },
  {
    path: '/forgot-password',
    element: (
      <Suspense fallback={<PageLoader />}>
        <ForgotPasswordPage />
      </Suspense>
    ),
  },
  {
    path: '/onboarding',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<PageLoader />}>
          <OnboardingPage />
        </Suspense>
      </ProtectedRoute>
    ),
  },

  // === RUTAS DE APP (autenticadas) ===
  {
    path: '/app',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/app/home" replace /> },
      {
        path: 'home',
        element: <Suspense fallback={<PageLoader />}><HomePage /></Suspense>,
      },
      {
        path: 'map',
        element: <Suspense fallback={<PageLoader />}><MapPage /></Suspense>,
      },
      {
        path: 'worlds',
        element: <Suspense fallback={<PageLoader />}><WorldsPage /></Suspense>,
      },
      {
        path: 'courses/:id',
        element: <Suspense fallback={<PageLoader />}><CoursePage /></Suspense>,
      },
      {
        path: 'lesson/:id',
        element: <Suspense fallback={<PageLoader />}><LessonPage /></Suspense>,
      },
      {
        path: 'code-lab/:id',
        element: <Suspense fallback={<PageLoader />}><CodeLabPage /></Suspense>,
      },
      {
        path: 'profile',
        element: <Suspense fallback={<PageLoader />}><ProfilePage /></Suspense>,
      },
      {
        path: 'achievements',
        element: <Suspense fallback={<PageLoader />}><AchievementsPage /></Suspense>,
      },
      {
        path: 'plus',
        element: <Suspense fallback={<PageLoader />}><PlusPage /></Suspense>,
      },
      {
        path: 'leaderboard',
        element: <Suspense fallback={<PageLoader />}><LeaderboardPage /></Suspense>,
      },
      {
        path: 'settings',
        element: <Suspense fallback={<PageLoader />}><SettingsPage /></Suspense>,
      },
      {
        path: 'training',
        element: <Suspense fallback={<PageLoader />}><TrainingPage /></Suspense>,
      },
    ],
  },

  // === RUTAS ADMIN ===
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <Suspense fallback={<PageLoader />}>
          <AdminLayout />
        </Suspense>
      </AdminRoute>
    ),
    children: [
      { index: true, element: <Suspense fallback={<PageLoader />}><AdminDashboard /></Suspense> },
    ],
  },

  // === 404 ===
  {
    path: '*',
    element: (
      <Suspense fallback={<PageLoader />}>
        <NotFoundPage />
      </Suspense>
    ),
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
