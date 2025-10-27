import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';
import Profile from './pages/Profile';
import ParasWallet from './pages/ParasWallet';
import React from 'react';

// Lazy load pages for better performance
const SangyanHome = lazy(() => import('./pages/SangyanHome'));
const About = lazy(() => import('./pages/About'));
const BlogList = lazy(() => import('./pages/BlogList'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const Events = lazy(() => import('./pages/Events'));
const Team = lazy(() => import('./pages/Team'));
const Resources = lazy(() => import('./pages/Resources'));
const Membership = lazy(() => import('./pages/Membership'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <LoadingSpinner />
  </div>
);

// Wrapper component for Layout with Outlet
const LayoutWrapper = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public routes WITHOUT Layout (they have their own Navbar/Footer) */}
            <Route path="/" element={<SangyanHome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Public routes WITH Layout */}
            <Route element={<LayoutWrapper />}>
              <Route path="/about" element={<About />} />
              <Route path="/team" element={<Team />} />

              {/* Protected routes - require authentication */}
              <Route
                path="/blog"
                element={
                  <ProtectedRoute>
                    <BlogList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/blog/:id"
                element={
                  <ProtectedRoute>
                    <BlogDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/events"
                element={
                  <ProtectedRoute>
                    <Events />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/resources"
                element={
                  <ProtectedRoute>
                    <Resources />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/membership"
                element={
                  <ProtectedRoute>
                    <Membership />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/paras-wallet"
                element={
                  <ProtectedRoute>
                    <ParasWallet />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
