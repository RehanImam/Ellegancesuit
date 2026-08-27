

import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import Loader from "./components/Loader";
import BestSellers from "./components/BestSellers";
import ExploreColors from "./components/ExploreColors"; // Added import
import AboutStory from "./components/AboutStory"; // Added import
import ScrollToTop from "./components/ScrollToTop";
import NewArrivals from "./components/NewArrivals";
// import VideoGallery from "./components/VideoGallery";


import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import OrderSuccess from "./pages/OrderSuccess";

import Login from "./auth/Login";
import Signup from "./auth/Signup";
import { useCart } from "./context/CartContext";

const MainLayout = () => {
  const { isCartDrawerOpen, closeCartDrawer, openCartDrawer } = useCart();

  return (
    <div className="min-h-screen flex flex-col bg-[#fff8fa]">
      {/* Navbar */}
      <Navbar onOpenCart={openCartDrawer} />

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
                  <NewArrivals />
                  {/* <VideoGallery /> */}
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

          <Route
            path="/wishlist"
            element={<Wishlist />}
          />

          <Route
            path="/checkout"
            element={<Checkout />}
          />

          <Route
            path="/payment"
            element={<Payment />}
          />

          <Route
            path="/order-success/:orderId"
            element={<OrderSuccess />}
          />
          
          <Route
            path="/order-success"
            element={<OrderSuccess />}
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
        isOpen={isCartDrawerOpen}
        onClose={closeCartDrawer}
      />
    </div>
  );
};

const App = () => {
  // Loader state
  const [loading, setLoading] = useState(true);

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
      <ScrollToTop />
      <MainLayout />
    </BrowserRouter>
  );
};

export default App;