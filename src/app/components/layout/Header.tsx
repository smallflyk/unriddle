"use client";

import { useState } from 'react';
import Link from 'next/link';
import { FaBars, FaTimes } from 'react-icons/fa';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-bold gradient-text">Unriddle</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="#features" className="text-gray-700 dark:text-gray-200 hover:text-primary">
            功能特点
          </Link>
          <Link href="#how-it-works" className="text-gray-700 dark:text-gray-200 hover:text-primary">
            工作原理
          </Link>
          <Link href="#pricing" className="text-gray-700 dark:text-gray-200 hover:text-primary">
            定价方案
          </Link>
          <Link href="#testimonials" className="text-gray-700 dark:text-gray-200 hover:text-primary">
            客户评价
          </Link>
          <Link href="#faq" className="text-gray-700 dark:text-gray-200 hover:text-primary">
            常见问题
          </Link>
        </nav>
        
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/login" className="btn btn-secondary">
            登录
          </Link>
          <Link href="/signup" className="btn btn-primary">
            免费注册
          </Link>
        </div>
        
        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 dark:text-gray-200 focus:outline-none"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white dark:bg-gray-900 shadow-md">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link 
              href="#features" 
              className="text-gray-700 dark:text-gray-200 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              功能特点
            </Link>
            <Link 
              href="#how-it-works" 
              className="text-gray-700 dark:text-gray-200 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              工作原理
            </Link>
            <Link 
              href="#pricing" 
              className="text-gray-700 dark:text-gray-200 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              定价方案
            </Link>
            <Link 
              href="#testimonials" 
              className="text-gray-700 dark:text-gray-200 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              客户评价
            </Link>
            <Link 
              href="#faq" 
              className="text-gray-700 dark:text-gray-200 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              常见问题
            </Link>
            <div className="flex flex-col space-y-3 pt-4">
              <Link href="/login" className="btn btn-secondary w-full text-center">
                登录
              </Link>
              <Link href="/signup" className="btn btn-primary w-full text-center">
                免费注册
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 