import React, { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Home from "../components/home/Home";
import ProductDetails from "../components/productDetails/ProductDetails";
import AddAddress from "../components/addAddress/AddAddress";
import AddProduct from "../components/addProduct/AddProduct";
import EditProduct from "../components/editProduct/EditProduct";
import { logData } from "./fetch";
import Login from "../components/login/Login";
import Signup from "../components/signup/Signup";

export default function AllRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  //To check if the user is already logged in navigate to Products page
  useEffect(() => {
    if (logData() && location.pathname == "/") {
      navigate("/products");
    } else if (!logData() && location.pathname == "/") {
      navigate("/login");
    }
  });
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/products" element={<Home />} />
        <Route path="/products/:name" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/addaddress/:id/:qty" element={<AddAddress />} />
        <Route path="/addproduct" element={<AddProduct />} />
        <Route path="/editproduct/:id" element={<EditProduct />} />
      </Routes>
    </div>
  );
}
