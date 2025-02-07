// App.js
import { Suspense, lazy, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Loader from "./common/Loader";
import routes from "./routes";
import SignIn from "./pages/Authentication/SignIn";
import SignUp from "./pages/Authentication/SignUp";

const DefaultLayout = lazy(() => import("./layout/DefaultLayout"));
const Landing = lazy(() => import("./pages/Landing"));

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        containerClassName="overflow-auto"
      />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          {/* All protected routes under DefaultLayout */}
          <Route element={<DefaultLayout />}>
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
