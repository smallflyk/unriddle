"use client";

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { FaFilePdf, FaTrash, FaSpinner } from 'react-icons/fa';

export default function PdfToolPage() {
  const [pdfText, setPdfText] = useState('');
  const [fileName, setFileName] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadStep, setUploadStep] = useState<'upload' | 'extract' | 'analyze'>('upload');

  // 处理文件上传
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    if (file.type !== 'application/pdf') {
      setError('请上传PDF文件');
      return;
    }

    setFileName(file.name);
    // 在真实系统中，这里应该调用API将PDF转换为文本
    // 这里简化为直接提示用户输入提取的文本
    setUploadStep('extract');
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  // 处理PDF分析请求
  const handleAnalyzePdf = async () => {
    if (!pdfText.trim()) {
      setError('请输入PDF文本内容');
      return;
    }

    setLoading(true);
    setError('');
    setResult('');

    try {
      const response = await fetch('/api/analyze-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pdfText: pdfText
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '处理请求时出错');
      }

      setResult(data.content);
      setUploadStep('analyze');
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误');
    } finally {
      setLoading(false);
    }
  };

  // 重置状态
  const handleReset = () => {
    setPdfText('');
    setFileName('');
    setResult('');
    setError('');
    setUploadStep('upload');
  };

  return (
    <>
      <Header />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-10 text-center">
            <span className="gradient-text">PDF</span>智能分析
          </h1>

          <div className="max-w-4xl mx-auto">
            {/* 步骤指示器 */}
            <div className="flex items-center justify-center mb-10">
              <div className={`flex flex-col items-center ${uploadStep === 'upload' ? 'text-primary' : 'text-gray-500'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${uploadStep === 'upload' ? 'border-primary bg-primary/10' : 'border-gray-300 bg-gray-100'}`}>
                  1
                </div>
                <span className="mt-2 text-sm">上传PDF</span>
              </div>
              <div className={`w-20 h-0.5 ${uploadStep !== 'upload' ? 'bg-primary' : 'bg-gray-300'}`}></div>
              <div className={`flex flex-col items-center ${uploadStep === 'extract' ? 'text-primary' : 'text-gray-500'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${uploadStep === 'extract' ? 'border-primary bg-primary/10' : 'border-gray-300 bg-gray-100'}`}>
                  2
                </div>
                <span className="mt-2 text-sm">提取文本</span>
              </div>
              <div className={`w-20 h-0.5 ${uploadStep === 'analyze' ? 'bg-primary' : 'bg-gray-300'}`}></div>
              <div className={`flex flex-col items-center ${uploadStep === 'analyze' ? 'text-primary' : 'text-gray-500'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${uploadStep === 'analyze' ? 'border-primary bg-primary/10' : 'border-gray-300 bg-gray-100'}`}>
                  3
                </div>
                <span className="mt-2 text-sm">分析结果</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
              {uploadStep === 'upload' && (
                <div>
                  <div 
                    {...getRootProps()} 
                    className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 dark:border-gray-600'}`}
                  >
                    <input {...getInputProps()} />
                    <FaFilePdf className="mx-auto mb-4 text-4xl text-gray-400 dark:text-gray-500" />
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                      {isDragActive ? '拖放文件到这里...' : '点击或拖放PDF文件到这里'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      支持的文件类型: PDF (最大50MB)
                    </p>
                  </div>
                  <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
                    上传PDF文件后，我们的AI将分析其内容并提供详细的研究见解。
                  </p>
                </div>
              )}

              {uploadStep === 'extract' && (
                <div>
                  <div className="flex items-center mb-6">
                    <FaFilePdf className="text-primary text-xl mr-2" />
                    <span className="text-gray-800 dark:text-gray-200 font-medium">{fileName}</span>
                    <button 
                      onClick={handleReset}
                      className="ml-auto text-gray-500 hover:text-red-500"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="pdfText" className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                      PDF文本内容
                    </label>
                    <textarea
                      id="pdfText"
                      value={pdfText}
                      onChange={(e) => setPdfText(e.target.value)}
                      rows={12}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      placeholder="粘贴从PDF提取的文本内容..."
                    ></textarea>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      请粘贴从PDF中提取的文本。在完整版中，我们会自动提取PDF内容。
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={handleReset}
                      className="btn btn-secondary"
                    >
                      返回
                    </button>
                    <button
                      onClick={handleAnalyzePdf}
                      disabled={loading}
                      className="btn btn-primary"
                    >
                      {loading ? (
                        <>
                          <FaSpinner className="animate-spin mr-2" />
                          分析中...
                        </>
                      ) : '分析PDF内容'}
                    </button>
                  </div>
                </div>
              )}

              {uploadStep === 'analyze' && result && (
                <div>
                  <div className="flex items-center mb-6">
                    <FaFilePdf className="text-primary text-xl mr-2" />
                    <span className="text-gray-800 dark:text-gray-200 font-medium">{fileName}</span>
                    <button 
                      onClick={handleReset}
                      className="ml-auto text-primary hover:underline"
                    >
                      分析新文件
                    </button>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">分析结果</h3>
                    <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-gray-800 dark:text-gray-200 whitespace-pre-line">
                      {result}
                    </div>
                    <div className="mt-4 text-right">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(result);
                          alert('已复制到剪贴板');
                        }}
                        className="text-sm text-primary hover:underline"
                      >
                        复制结果
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg mt-6">
                  {error}
                </div>
              )}
            </div>

            <div className="max-w-4xl mx-auto mt-12 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                此演示版本需要手动输入PDF内容。
                <a href="/signup" className="text-primary hover:underline ml-1">
                  升级到完整版
                </a>
                可自动提取和分析PDF内容。
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 