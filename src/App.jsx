import { Toaster } from "react-hot-toast";
import { Suspense, lazy, useEffect, useState } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { toast } from "react-hot-toast";
import Loader from "./common/Loader";
import routes from "./routes";
import SignIn from "./pages/Authentication/SignIn";
import SignUp from "./pages/Authentication/SignUp";

const DefaultLayout = lazy(() => import("./layout/DefaultLayout"));
const Landing = lazy(() => import("./pages/Landing"));

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [location]);

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
};

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) return <Loader />;

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            style: {
              background: "#28a745",
            },
          },
          error: {
            duration: 4000,
            style: {
              background: "#dc3545",
            },
          },
          loading: {
            duration: Infinity,
            style: {
              background: "#363636",
            },
          },
        }}
      />

      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected routes under DefaultLayout */}
          <Route
            element={
              <ProtectedRoute>
                <DefaultLayout />
              </ProtectedRoute>
            }
          >
            {routes.map((route, index) => {
              const { path, component: Component } = route;
              return (
                <Route
                  key={index}
                  path={path}
                  element={
                    <Suspense fallback={<Loader />}>
                      <Component />
                    </Suspense>
                  }
                />
              );
            })}
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
