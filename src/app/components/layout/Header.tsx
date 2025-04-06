"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';

interface User {
  name: string;
  email: string;
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // 初始化时检查登录状态
  useEffect(() => {
    // 从localStorage读取登录状态
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userData = localStorage.getItem('user');
    
    setIsLoggedIn(loggedIn);
    if (loggedIn && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (e) {
        console.error('解析用户数据失败:', e);
        // 解析失败时清除可能损坏的数据
        localStorage.removeItem('user');
      }
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };
  
  const handleLogout = () => {
    // 清除登录状态
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setIsUserMenuOpen(false);
    
    // 重定向到首页
    window.location.href = '/';
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
          {isLoggedIn ? (
            <div className="relative">
              <button 
                onClick={toggleUserMenu}
                className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-primary"
              >
                <FaUserCircle className="text-xl" />
                <span>{user?.name || '用户'}</span>
              </button>
              
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{user?.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                  </div>
                  <Link href="/tools" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    我的工具
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    退出登录
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="btn btn-secondary">
                登录
              </Link>
              <Link href="/signup" className="btn btn-primary">
                免费注册
              </Link>
            </>
          )}
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
              {isLoggedIn ? (
                <>
                  <Link 
                    href="/tools" 
                    className="text-gray-700 dark:text-gray-200 py-2 flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaUserCircle className="mr-2" />
                    {user?.name || '用户'}
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-red-600 dark:text-red-400 py-2 text-left"
                  >
                    退出登录
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="btn btn-secondary w-full text-center">
                    登录
                  </Link>
                  <Link href="/signup" className="btn btn-primary w-full text-center">
                    免费注册
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 