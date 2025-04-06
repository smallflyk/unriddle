"use client";

import { useState } from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

export default function ResearchToolPage() {
  const [researchTopic, setResearchTopic] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 处理研究建议请求
  const handleGetSuggestions = async () => {
    if (!researchTopic.trim()) {
      setError('请输入研究主题');
      return;
    }

    setLoading(true);
    setError('');
    setResult('');

    try {
      const response = await fetch('/api/research-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: researchTopic
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '处理请求时出错');
      }

      setResult(data.content);
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-10 text-center">
            <span className="gradient-text">研究建议</span>生成器
          </h1>

          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
            <div className="mb-6">
              <label htmlFor="researchTopic" className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                研究主题
              </label>
              <input
                type="text"
                id="researchTopic"
                value={researchTopic}
                onChange={(e) => setResearchTopic(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                placeholder="例如：人工智能在教育中的应用"
              />
            </div>

            <div className="mb-8">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                我们的AI将分析您的研究主题，提供该领域的最新研究动向、潜在研究问题、推荐的研究方法以及可能面临的挑战和应对策略。
              </p>
            </div>

            <div className="mb-6">
              <button
                onClick={handleGetSuggestions}
                disabled={loading}
                className="btn btn-primary w-full"
              >
                {loading ? '生成中...' : '获取研究建议'}
              </button>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
                {error}
              </div>
            )}

            {result && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">研究建议</h3>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-gray-800 dark:text-gray-200 whitespace-pre-line">
                  {result}
                </div>
                <div className="mt-4 text-right">
                  <button
                    onClick={() => {
                      // 复制内容到剪贴板
                      navigator.clipboard.writeText(result);
                      alert('已复制到剪贴板');
                    }}
                    className="text-sm text-primary hover:underline"
                  >
                    复制结果
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="max-w-4xl mx-auto mt-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              想要使用更多高级研究工具？
              <a href="/signup" className="text-primary hover:underline ml-1">
                注册Unriddle
              </a>
              获取完整功能。
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 