"use client";

import { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { TextProcessingType } from '../services/openai';

export default function ToolsPage() {
  const [inputText, setInputText] = useState('');
  const [processType, setProcessType] = useState<TextProcessingType>('summarize');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 处理文本分析请求
  const handleProcessText = async () => {
    if (!inputText.trim()) {
      setError('请输入要处理的文本');
      return;
    }

    setLoading(true);
    setError('');
    setResult('');

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          type: processType
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
            Unriddle <span className="gradient-text">文本分析工具</span>
          </h1>

          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
            <div className="mb-6">
              <label htmlFor="processType" className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                处理类型
              </label>
              <select
                id="processType"
                value={processType}
                onChange={(e) => setProcessType(e.target.value as TextProcessingType)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              >
                <option value="summarize">生成摘要</option>
                <option value="analyze">分析内容</option>
                <option value="extract-key-points">提取关键点</option>
                <option value="generate-questions">生成研究问题</option>
                <option value="literature-review">生成文献综述</option>
              </select>
            </div>

            <div className="mb-6">
              <label htmlFor="inputText" className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                输入文本
              </label>
              <textarea
                id="inputText"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={10}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                placeholder="请输入要处理的学术文本..."
              ></textarea>
            </div>

            <div className="mb-6">
              <button
                onClick={handleProcessText}
                disabled={loading}
                className="btn btn-primary w-full"
              >
                {loading ? '处理中...' : '开始处理'}
              </button>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
                {error}
              </div>
            )}

            {result && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">处理结果</h3>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-gray-800 dark:text-gray-200 whitespace-pre-line">
                  {result}
                </div>
              </div>
            )}
          </div>

          <div className="max-w-4xl mx-auto mt-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              这只是Unriddle强大功能的一小部分展示。 
              <a href="/" className="text-primary hover:underline">返回首页</a> 
              了解更多或 
              <a href="/signup" className="text-primary hover:underline">注册</a> 
              使用完整版本。
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 