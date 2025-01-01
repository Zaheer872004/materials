import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaFacebook, FaTwitter, FaLinkedinIn, FaBars, FaXmark } from "react-icons/fa6";

const Navbar = () => {

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  }


  // navItems
  const navItems = [
    { path: "/", link: "Home" },
    { path: "/services", link: "Services" },
    { path: "/about", link: "About" },
    { path: "/blogs", link: "Blogs" },
    { path: "/contact", link: "Contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-gradient-to-r from-orange-300 to-violet-400 text-black">
      <nav className="py-6 px-10 max-w-10xl mx-auto flex justify-between items-center">
        <a href="/" className="text-4xl font-bold">
          Design
          <span className="font-extrabold bg-gradient-to-r from-white to-blue-600 text-transparent bg-clip-text">
            ZK
          </span>
        </a>

        {/* navItems for larger devices */}
        <ul className="hidden md:flex gap-12 text-2xl">
          {navItems.map(({ path, link }) => (
            <li key={path} className="hover:underline">
              <NavLink
                to={path}
                className=""
              >
                {link}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Menu icons and buttons */}
        <div className="hidden lg:flex gap-10 items-center">
          <a href="/" className="text-2xl hover:text-white">
            <FaFacebook />
          </a>
          <a href="/" className="text-2xl hover:text-white">
            <FaTwitter />
          </a>
          <a href="/" className="text-2xl hover:text-white">
            <FaLinkedinIn />
          </a>

          <button className="text-2xl px-6 py-2 font-medium rounded-md text-black font-mono bg-gradient-to-r from-orange-400 to-white hover:ring-4 shadow-2xl shadow-red-950 hover:font-extrabold transition-all duration-200 ease-in">
            LogIn
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="cursor-pointer">
              {
                isMenuOpen ? <FaXmark className="w-5 h-5" /> : <FaBars className="w-5 h-5" />
              }
              

          </button>
        </div>
      </nav>

      {/* menu items only for mobile */}

      <div>
      <ul className= {`${isMenuOpen ?  "md:hidden bg-gradient-to-r from-blue-300 to-green-300 text-white font-extrabold py-3 space-y-3 text-2xl  flex flex-col items-center transition-all ease-out duration-150": "hidden"}`}>
          {navItems.map(({ path, link }) => (
            <li key={path} className="hover:underline">
              <NavLink
               
               onClick={toggleMenu}
                to={path}
                className=""
              >
                {link}
              </NavLink>
            </li>
          ))}
          <button className="text-2xl px-6 py-2 font-medium rounded-md text-black font-mono bg-gradient-to-r from-orange-400 to-white hover:ring-4 shadow-2xl shadow-red-950 hover:font-extrabold transition-all duration-200 ease-in">
            LogIn
          </button> 
         
      </ul>  
      

      </div>


    </header>
  );
};

export default Navbar;
