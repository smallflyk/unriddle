"use client";

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

// 创建一个组件来使用useSearchParams
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  // 如果已登录且不是从重定向来的，直接跳转到工具页面
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn && !redirectUrl) {
      window.location.href = '/tools';
    }
  }, [redirectUrl]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 简单验证
    if (!email || !password) {
      setError('请填写所有字段');
      return;
    }
    
    setLoading(true);
    setError('');
    
    // 实际项目中，这里应该调用API进行登录验证
    // 这里只是模拟登录过程
    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 将登录状态保存到localStorage
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify({
        email: email,
        name: email.split('@')[0], // 简单地从邮箱提取用户名
        loginTime: new Date().toISOString()
      }));
      
      // 登录成功后重定向
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        window.location.href = '/tools';
      }
    } catch (err) {
      setError('登录失败，请检查您的凭据');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
      <h1 className="text-2xl font-bold mb-6 text-center">登录 <span className="gradient-text">Unriddle</span></h1>
      
      {redirectUrl && (
        <div className="mb-6 p-4 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg text-sm">
          请先登录以访问该页面
        </div>
      )}
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 mb-2 text-sm font-medium">
            邮箱地址
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm"
            placeholder="your@email.com"
            required
          />
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="password" className="text-gray-700 dark:text-gray-300 text-sm font-medium">
              密码
            </label>
            <Link href="/forgot-password" className="text-primary text-sm hover:underline">
              忘记密码?
            </Link>
          </div>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm"
            placeholder="••••••••"
            required
          />
        </div>
        
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={loading}
        >
          {loading ? '登录中...' : '登录'}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          还没有账号? 
          <Link href="/signup" className="text-primary ml-1 hover:underline">
            免费注册
          </Link>
        </p>
      </div>
    </div>
  );
}

// 使用Suspense包裹使用useSearchParams的组件
export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <Suspense fallback={
            <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
              <p className="text-center">加载中...</p>
            </div>
          }>
            <LoginForm />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
} 