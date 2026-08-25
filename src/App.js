

import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import Loader from "./components/Loader";
import BestSellers from "./components/BestSellers";
import ExploreColors from "./components/ExploreColors"; // Added import
import AboutStory from "./components/AboutStory"; // Added import

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";

import Login from "./auth/Login";
import Signup from "./auth/Signup";

const App = () => {
  // Loader state
  const [loading, setLoading] = useState(true);

  // Cart Drawer state
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  // Show loader while website is loading
  if (loading) {
    return <Loader />;
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#fff8fa]">

        {/* Navbar */}
        <Navbar
          onOpenCart={() => setCartDrawerOpen(true)}
        />

        {/* Main Content */}
        <div className="flex-1">

          <Routes>

            <Route
              path="/"
              element={
                <>
                  <Home />
                  <BestSellers />
                  <ExploreColors />
                  <AboutStory />
                </>
              }
            />

            <Route
              path="/shop"
              element={<Shop />}
            />

            <Route
              path="/product/:id"
              element={<ProductDetails />}
            />

            <Route
              path="/cart"
              element={<Cart />}
            />

            {/* Auth Routes */}
            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/signup"
              element={<Signup />}
            />

          </Routes>

        </div>

        {/* Footer */}
        <Footer />

        {/* Cart Drawer */}
        <CartDrawer
          isOpen={cartDrawerOpen}
          onClose={() => setCartDrawerOpen(false)}
        />

      </div>
    </BrowserRouter>
  );
};

export default App;