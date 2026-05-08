import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import JobDetails from './pages/JobDetails';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Apply from './pages/Apply';
import Dashboard from './pages/Dashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import AdminDashboard from './pages/AdminDashboard';
import RecruiterSignup from './pages/RecruiterSignup';
import RecruiterLogin from './pages/RecruiterLogin';
import CompanyPage from './pages/CompanyPage';

function App() {
  // Lazy initializer: reads localStorage synchronously on the very first render.
  // This prevents the null→user flash that was redirecting users to /login on refresh.
  // Security is unchanged — the JWT token is still validated server-side on every request.
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Navbar user={user} logout={logout} />
        <main className="flex-1">
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/signup" element={<Signup setUser={setUser} />} />
            <Route path="/apply/:id" element={<Apply user={user} />} />
            <Route path="/company/:id" element={<CompanyPage />} />

            {/* Recruiter auth (separate flow, linked from footer) */}
            <Route path="/recruiter/signup" element={<RecruiterSignup setUser={setUser} />} />
            <Route path="/recruiter/login" element={<RecruiterLogin setUser={setUser} />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={user?.role === 'APPLICANT' ? <Dashboard user={user} /> : <Navigate to="/login" />}
            />
            <Route
              path="/recruiter"
              element={user?.role === 'RECRUITER' ? <RecruiterDashboard user={user} setUser={setUser} /> : <Navigate to="/recruiter/login" />}
            />
            <Route
              path="/admin"
              element={user?.role === 'ADMIN' ? <AdminDashboard user={user} /> : <Navigate to="/login" />}
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
