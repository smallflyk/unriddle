"use client";

import { useState } from 'react';
import Link from 'next/link';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 简单验证
    if (!email) {
      setError('请输入邮箱地址');
      return;
    }
    
    setLoading(true);
    setError('');
    
    // 实际项目中，这里应该调用API发送重置密码邮件
    // 这里只是模拟过程
    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 重置邮件发送成功
      setSuccess(true);
    } catch (err) {
      setError('发送重置邮件失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
            <h1 className="text-2xl font-bold mb-6 text-center">忘记密码</h1>
            
            {success ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-500 mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold mb-4">重置链接已发送</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  我们已向 <span className="font-medium">{email}</span> 发送了密码重置链接。请检查您的邮箱，并按照邮件中的指示重置密码。
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                  如果您没有收到邮件，请检查垃圾邮件文件夹或在几分钟后重试。
                </p>
                <Link href="/login" className="btn btn-primary">
                  返回登录
                </Link>
              </div>
            ) : (
              <>
                <p className="text-gray-700 dark:text-gray-300 mb-8 text-center">
                  请输入您的注册邮箱，我们将向您发送重置密码的链接。
                </p>
                
                {error && (
                  <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
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
                  
                  <button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={loading}
                  >
                    {loading ? '发送中...' : '发送重置链接'}
                  </button>
                </form>
                
                <div className="mt-6 text-center">
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    记起密码了? 
                    <Link href="/login" className="text-primary ml-1 hover:underline">
                      返回登录
                    </Link>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 