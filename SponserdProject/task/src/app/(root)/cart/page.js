'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, updateQuantity, setDiscount } from "@/redux/cartSlice";
import { ClipLoader } from "react-spinners";
import Link from "next/link"
import ProtectedHomeRoute from "@/components/ProtectedHomeRoute";
const Cart = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const subtotal = useSelector((state) => state.cart.subtotal);
  const total = useSelector((state) => state.cart.total);
  const discountAmount = useSelector((state) => state.cart.discountAmount);
  const [coupon, setCoupon] = useState("");
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [error, setError] = useState("");
  const [deliveryFee] = useState(15);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isPopupVisible1, setIsPopupVisible1] = useState(false);
  const [isPopupVisible2, setIsPopupVisible2] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      setIsPopupVisible(true);
    } else {
      router.push('/checkout');
    }
  };

  const handleDelete = (item) => {
    dispatch(removeFromCart(item));
  };

  const handleQuantityChange = (id, change) => {
    const itemIndex = cartItems.findIndex(item => item.id === id);
    const currentQuantity = cartItems[itemIndex]?.quantity || 1;
    const newQuantity = currentQuantity + change;

    if (newQuantity < 1) return;

    dispatch(updateQuantity({ id, quantity: newQuantity }));
  };

  const handleApplyCoupon = async () => {
    if (!coupon) return;

    try {
      setValidatingCoupon(true);
      const response = await fetch(`/api/coupons/getCouponsByTitle?couponTitle=${coupon}`);
  
      if (!response.ok) {
        if (response.status === 404) {
          setIsPopupVisible1(true);
          dispatch(setDiscount(0)); // Reset discount if coupon not found
        } else {
          setError("Error applying coupon");
        }
        return;
      }
  
      const { coupons } = await response.json();
      const couponData = coupons[0];
  
      if (subtotal < couponData.minPrice) {
        setIsPopupVisible2(true);
        return;
      }
  
      dispatch(setDiscount(couponData.discount));
      setError("");
    } catch (error) {
      console.error("Error applying coupon:", error);
      setError("An error occurred while applying the coupon.");
    } finally {
      setValidatingCoupon(false);
    }
  };

  const closePopup = () => setIsPopupVisible(false);
  const closePopup1 = () => setIsPopupVisible1(false);
  const closePopup2 = () => setIsPopupVisible2(false);

  return (
    <div className="flex bg-white text-black flex-col px-4 md:px-8 font-poppins">
      <div className="flex items-center mt-4 md:mt-8">
        <span className="text-sm md:text-lg text-[#676767]">Home</span>
        <img src="images/services/arrow.png" alt="Arrow" className="mx-2 w-3 h-3 md:w-4 md:h-4" />
        <span className="text-sm md:text-lg">Cart</span>
      </div>

      <div className="flex flex-col lg:flex-row justify-between mt-6">
        <div className="w-full lg:w-8/12 p-4 md:p-6 lg:p-10">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Your cart</h2>

          {cartItems.map((item) => (
            <div key={item.id} className="border border-gray-300 bg-white p-4 rounded-lg flex items-center justify-between mb-4 flex-col sm:flex-row">
              <div className="flex items-center mb-4 sm:mb-0">
                <img src={item.images[0]} alt={item.title} className="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded-lg bg-[#f0eeed]" />
                <div className="ml-4">
                  <h3 className="font-bold text-base md:text-lg">{item.title}</h3>
                  <p className="text-xs md:text-sm my-1">Size: <span className="text-[#676767]">{item.size}</span></p>
                  <p className="font-bold text-lg">INR {item.sellingPrice}</p>
                </div>
              </div>
              <div className="flex lg:flex-col sm:flex-row-reverse items-center lg:items-end w-full lg:w-auto justify-between">
                <img src="images/common/dustbin.png" alt="Delete" className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer lg:mt-2 ml-4 sm:ml-0" onClick={() => handleDelete(item)} />
                <div className="flex items-center mt-12 bg-[#F0F0F0] px-2 py-1 rounded-2xl">
                  <button className="px-2" onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                  <span className="mx-2">{item.quantity || 1}</span>
                  <button className="px-2" onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full lg:w-5/12 mb-10 bg-white h-full p-6 rounded-lg lg:mt-24 shadow-lg border border-gray-300">
          <h2 className="text-lg md:text-xl font-semibold mb-3">Order Summary</h2>
          <div className="mb-4">
            <div className="flex justify-between">
              <span className="text-[#676767] text-sm md:text-lg mb-2">Subtotal</span>
              <span className="font-bold">INR {subtotal }</span>
            </div>
            <div className="flex justify-between text-[#E57A7A]">
              <span className="text-[#676767] text-sm md:text-lg mb-2">Discount (-{discountAmount}%)</span>
              {/* <span className="font-bold">-INR {(subtotal * discountAmount / 100).toFixed(2)||`0`}</span> */}
            </div>
            <div className="flex justify-between">
              <span className="text-[#676767] text-sm md:text-lg mb-1">Delivery Fee</span>
              <span className="font-bold">INR 15</span>
            </div>
          </div>
          <hr className="border-t border-gray-300 my-4" />
          <div className="flex justify-between mb-3">
            <span className="text-lg md:text-xl font-semibold">Total</span>
            <span className="font-bold">INR {total + deliveryFee }</span>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row items-center">
            <div className="flex items-center bg-[#F0F0F0] rounded-full flex-1 mb-2 sm:mb-0">
              <img src="images/common/coupon.png" alt="Coupon Icon" className="w-5 h-5 sm:w-6 sm:h-6 mx-2" />
              <input 
                type="text" 
                className="flex-1 p-2 bg-[#F0F0F0] rounded-full outline-none text-sm" 
                placeholder="Coupon Code"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
              />
            </div>
            <button 
              className="bg-[#E57A7A] text-white px-4 lg:mt-0 mt-2 sm:px-6 py-2 rounded-full ml-2" 
              onClick={handleApplyCoupon}
              disabled={validatingCoupon}
            >
              {
                validatingCoupon ? <ClipLoader size={20} color="#fff" className="mx-10"/> : "Apply Coupon"
              }
            </button>
            {error && <p className="text-red-600 mt-2">{error}</p>}
          </div>
          
          <button className="w-full bg-[#E57A7A] text-white py-3 rounded-full mt-4" onClick={handleProceedToCheckout}>
            <p>Proceed to Checkout</p>
          </button>
          <Link href="/my-orders">
              <button
                className="w-full bg-[#E57A7A] text-white py-3 rounded-full mt-4"
                
              >
                 View My Orders
              </button>
              </Link>
        </div>
      </div>

      {/* Popups for Empty Cart, Invalid Coupon, and Minimum Subtotal */}
      {isPopupVisible && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
    <div className="bg-white p-8 rounded-lg shadow-lg relative">
      <button
        className="absolute top-2 right-2"
        onClick={closePopup}
        aria-label="Close popup"
      >
        <img
          src="/images/services/cross.png"
          alt="Close"
          className="w-4 h-4 m-1"
        />
      </button>
      <div className="flex flex-col mx-32 my-3 items-center">
        <img
          src="/images/services/cancel.png"
          alt="Fail Icon"
          className="w-32 h-32 mb-7"
        />
        <h3 className="text-lg font-semibold mb-2">Your cart is empty!</h3>
        <p>Please add items to your cart before proceeding.</p>
        <button className="mt-4 bg-[#E57A7A] text-white px-4 py-2 rounded" onClick={closePopup}>Close</button>
      </div>
    </div>
  </div>
)}

{isPopupVisible1 && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
    <div className="bg-white p-8 rounded-lg shadow-lg relative">
      <button
        className="absolute top-2 right-2"
        onClick={closePopup1}
        aria-label="Close popup"
      >
        <img
          src="/images/services/cross.png"
          alt="Close"
          className="w-4 h-4 m-1"
        />
      </button>
      <div className="flex flex-col mx-32 my-3 items-center">
        <img
          src="/images/services/cancel.png"
          alt="Fail Icon"
          className="w-32 h-32 mb-7"
        />
        <h3 className="text-lg font-semibold mb-2 mx-auto">Invalid Coupon!</h3>
        <p>The coupon code you entered is not valid.</p>
        <button className="mt-4 bg-[#E57A7A] text-white px-4 py-2 rounded" onClick={closePopup1}>Close</button>
      </div>
    </div>
  </div>
)}

{isPopupVisible2 && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
    <div className="bg-white p-8 rounded-lg shadow-lg relative">
      <button
        className="absolute top-2 right-2"
        onClick={closePopup2}
        aria-label="Close popup"
      >
        <img
          src="/images/services/cross.png"
          alt="Close"
          className="w-4 h-4 m-1"
        />
      </button>
      <div className="flex flex-col mx-32 my-3 items-center">
        <img
          src="/images/services/cancel.png"
          alt="Fail Icon"
          className="w-32 h-32 mb-7"
        />
        <h3 className="text-lg font-semibold mb-2">Minimum Subtotal Not Attained!</h3>
        <p>To apply this coupon, your subtotal must be a bit higher.</p>
        <button className="mt-4 bg-[#E57A7A] text-white px-4 py-2 rounded" onClick={closePopup2}>Close</button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default ProtectedHomeRoute(Cart);
