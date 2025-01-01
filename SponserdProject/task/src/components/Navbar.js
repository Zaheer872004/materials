"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FiMenu } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { clearUser } from "@/redux/userSlice";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state) => state.user.userId);
  const dispatch = useDispatch();
  const router = useRouter();
  const drawerRef = useRef(null);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const onLogout = () => {
    dispatch(clearUser());
    router.push("/signin");
  };

  // Close drawer when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <nav className="bg-white py-5 lg:px-12 sm:px-6 px-2 relative">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src="/images/logo.png"
            alt="BHAW Logo"
            className="sm:h-10 h-8 w-auto mx-2"
          />
        </div>

        {/* Navigation Links */}
        <ul className="hidden lg:flex flex-grow justify-center lg:space-x-8 text-gray-600">
          <li>
            <Link
              href="/about"
              onClick={() => setIsOpen(false)}
              className="hover:text-black text-[#8E8E8E] cursor-pointer"
            >
              ABOUT US
            </Link>
          </li>
          <li>
            <Link
              href="/products"
              onClick={() => setIsOpen(false)}
              className="hover:text-black text-[#8E8E8E] cursor-pointer"
            >
              PRODUCTS
            </Link>
          </li>
          <li>
            <Link
              href="/service"
              onClick={() => setIsOpen(false)}
              className="hover:text-black text-[#8E8E8E] cursor-pointer"
            >
              SERVICES
            </Link>
          </li>
          <li>
            <Link
              href="/blogs"
              onClick={() => setIsOpen(false)}
              className="hover:text-black text-[#8E8E8E] font-medium cursor-pointer"
            >
              BLOG
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="hover:text-black text-[#8E8E8E] cursor-pointer"
            >
              CONTACT US
            </Link>
          </li>
        </ul>

        {/* Icons and Buttons */}
        <div className="flex items-center space-x-4 ml-auto">
          {user ? (
            <>
              <Link href="/recommendation" onClick={() => setIsOpen(false)}>
                <button>
                  <img
                    src="/images/navbar/heart.png"
                    alt="Wishlist"
                    className="w-6 h-6"
                  />
                </button>
              </Link>
              <Link href="/cart" onClick={() => setIsOpen(false)}>
                <button>
                  <img
                    src="/images/navbar/cart.png"
                    alt="Cart"
                    className="w-6 h-6"
                  />
                </button>
              </Link>
              <button onClick={onLogout}>
                <img
                  src="/images/navbar/profile.png"
                  alt="Profile"
                  className="w-6 h-6 mb-2"
                />
              </button>
            </>
          ) : (
            <>
              <Link href="/signin" onClick={() => setIsOpen(false)}>
                <button className="text-[#8E8E8E] px-3 py-1 rounded-md">
                  LOGIN
                </button>
              </Link>
              <Link href="/signup" onClick={() => setIsOpen(false)}>
                <button className="flex items-center justify-between w-full bg-black text-white sm:px-8 px-4 py-2 rounded-full">
                  <p>Sign Up <span className="sm:inline-block hidden">Now</span></p>
                  <img
                    src="/images/navbar/image.png"
                    alt="Icon"
                    className="w-5 h-5 ml-2"
                  />
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Icon */}
        <div className="lg:hidden flex items-center">
          <button onClick={toggleDrawer} className="focus:outline-none">
            <FiMenu className="w-6 h-6 ml-4 text-gray-600 hover:text-black" />
          </button>
        </div>
      </div>

      {/* Drawer Menu */}
      {isOpen && (
        <div
          ref={drawerRef}
          className="absolute top-16 left-0 w-full bg-white shadow-lg z-20 lg:hidden"
        >
          <ul className="flex flex-col items-center text-gray-600 p-4">
            <li>
              <Link
                href="/about"
                onClick={() => setIsOpen(false)}
                className="hover:text-black text-[#C4B0A9] cursor-pointer py-2"
              >
                ABOUT US
              </Link>
            </li>
            <li>
              <Link
                href="/products"
                onClick={() => setIsOpen(false)}
                className="hover:text-black text-[#C4B0A9] cursor-pointer py-2"
              >
                PRODUCTS
              </Link>
            </li>
            <li>
              <Link
                href="/service"
                onClick={() => setIsOpen(false)}
                className="hover:text-black text-[#C4B0A9] cursor-pointer py-2"
              >
                SERVICES
              </Link>
            </li>
            <li>
              <Link
                href="/blogs"
                onClick={() => setIsOpen(false)}
                className="hover:text-black text-[#C4B0A9] font-medium cursor-pointer py-2"
              >
                BLOG
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="hover:text-black text-[#C4B0A9] cursor-pointer py-2"
              >
                CONTACT US
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
