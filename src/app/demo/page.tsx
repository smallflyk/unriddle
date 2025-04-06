"use client";

import { useState } from 'react';
import Link from 'next/link';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

export default function DemoPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 简单验证
    if (!name || !email) {
      setError('请填写必填字段');
      return;
    }
    
    setLoading(true);
    setError('');
    
    // 实际项目中，这里应该调用API发送演示请求
    // 这里只是模拟过程
    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 成功提交
      setSuccess(true);
    } catch (err) {
      setError('提交失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
            <h1 className="text-3xl font-bold mb-6 text-center">预约 <span className="gradient-text">Unriddle</span> 演示</h1>
            
            {success ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-500 mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-4">感谢您的预约！</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  我们已收到您的演示请求。我们的团队将在1-2个工作日内与您联系，安排详细的演示。
                </p>
                <Link href="/" className="btn btn-primary">
                  返回首页
                </Link>
              </div>
            ) : (
              <>
                <p className="text-gray-700 dark:text-gray-300 mb-8 text-center">
                  请填写以下表单，预约Unriddle产品的详细演示。我们的团队将与您联系，为您展示如何利用我们的AI工具提升您的研究效率。
                </p>
                
                {error && (
                  <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 mb-2 text-sm font-medium">
                      姓名 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm"
                      placeholder="您的姓名"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 mb-2 text-sm font-medium">
                      邮箱地址 <span className="text-red-500">*</span>
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
                  
                  <div className="mb-4">
                    <label htmlFor="organization" className="block text-gray-700 dark:text-gray-300 mb-2 text-sm font-medium">
                      组织/机构
                    </label>
                    <input
                      type="text"
                      id="organization"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm"
                      placeholder="您所在的组织或机构"
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-gray-700 dark:text-gray-300 mb-2 text-sm font-medium">
                      附加信息
                    </label>
                    <textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm"
                      placeholder="请告诉我们您对演示的具体需求或问题"
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={loading}
                  >
                    {loading ? '提交中...' : '预约演示'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 