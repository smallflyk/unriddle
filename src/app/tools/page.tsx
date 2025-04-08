"use client";

import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaFileUpload, FaSpinner, FaFileWord, FaFileAlt, FaFileCsv, FaCheck } from 'react-icons/fa';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { TextProcessingType } from '../services/openai';

// 类型定义
type MammothModule = {
  default: {
    extractRawText: (options: { arrayBuffer: ArrayBuffer }) => Promise<{ value: string }>;
  }
};

export default function ToolsPage() {
  const [inputText, setInputText] = useState('');
  const [processType, setProcessType] = useState<TextProcessingType>('summarize');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileLoading, setFileLoading] = useState(false);
  const [previewText, setPreviewText] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  
  // 存储动态加载的库
  const [mammoth, setMammoth] = useState<MammothModule | null>(null);
  const [isLibraryLoading, setIsLibraryLoading] = useState(true);
  
  // 客户端加载依赖库
  useEffect(() => {
    let isMounted = true;
    setIsLibraryLoading(true);
    
    const loadLibraries = async () => {
      try {
        // 动态导入mammoth
        const mammothModule = await import('mammoth');
        
        if (isMounted) {
          setMammoth(mammothModule);
          setIsLibraryLoading(false);
        }
      } catch (err) {
        console.error('加载库失败:', err);
        if (isMounted) {
          setIsLibraryLoading(false);
        }
      }
    };
    
    loadLibraries();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // 处理文件上传
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    setFileName(file.name);
    setFileLoading(true);
    setProcessingStatus('正在处理文件...');
    
    try {
      // 检查库是否正在加载
      if (isLibraryLoading) {
        throw new Error('正在加载文档处理库，请稍后重试');
      }
      
      const fileExt = file.name.toLowerCase().split('.').pop();
      
      // 根据文件类型显示不同的处理状态
      if (fileExt === 'docx') {
        setProcessingStatus('正在解析Word文档...');
      } else {
        setProcessingStatus('正在读取文件内容...');
      }
      
      // 读取文件内容
      const text = await readFileContent(file);
      setInputText(text);
      
      // 设置预览文本 (限制长度)
      setPreviewText(text.length > 500 ? text.substring(0, 500) + '...' : text);
      setShowPreview(true);
      setError('');
      setProcessingStatus('文件处理完成');
      
      // 延迟后清除状态消息
      setTimeout(() => {
        setProcessingStatus('');
      }, 2000);
    } catch (err) {
      console.error('文件读取错误:', err);
      setError(err instanceof Error ? err.message : '文件读取失败，请检查文件格式是否正确');
      setFileName('');
      setProcessingStatus('文件处理失败');
      
      // 延迟后清除状态消息
      setTimeout(() => {
        setProcessingStatus('');
      }, 3000);
    } finally {
      setFileLoading(false);
    }
  }, [isLibraryLoading]);

  // 读取文件内容的函数
  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const fileType = file.type;
      const fileName = file.name.toLowerCase();
      
      // 处理Word文档 (.docx)
      if (fileName.endsWith('.docx')) {
        // 检查mammoth库是否已加载
        if (!mammoth) {
          reject(new Error('文档处理库尚未加载完成，请刷新页面后重试'));
          return;
        }
        
        reader.onload = async (event) => {
          try {
            if (!event.target?.result) {
              throw new Error('Word文档读取失败');
            }
            
            // 使用mammoth解析docx文件
            const result = await mammoth.default.extractRawText({
              arrayBuffer: event.target.result as ArrayBuffer
            });
            
            if (result && result.value) {
              resolve(result.value);
            } else {
              throw new Error('无法提取Word文档内容');
            }
          } catch (error) {
            console.error('Word文档处理错误:', error);
            reject(new Error('Word文档处理失败，请尝试使用其他格式'));
          }
        };
        
        reader.onerror = () => {
          reject(new Error('Word文档读取错误'));
        };
        
        reader.readAsArrayBuffer(file);
      }
      // 处理旧版Word文档 (.doc)
      else if (fileName.endsWith('.doc')) {
        reader.onload = (event) => {
          if (event.target?.result) {
            // 旧版.doc文件仍需手动复制
            resolve(
              '由于浏览器限制，无法直接提取旧版Word文档(.doc)内容。\n' +
              '请手动复制Word文档内容并粘贴到此文本框中。\n' +
              '提示：将文件另存为.docx格式可以自动提取内容。\n' +
              '---\n\n'
            );
          } else {
            reject(new Error('Word文档读取失败'));
          }
        };
        
        reader.onerror = () => {
          reject(new Error('Word文档读取错误'));
        };
        
        // 尝试以文本方式读取，至少提供一些内容
        reader.readAsText(file);
      }
      // 处理文本文件
      else {
        reader.onload = (event) => {
          if (event.target?.result) {
            resolve(event.target.result as string);
          } else {
            reject(new Error('读取文件内容为空'));
          }
        };
        
        reader.onerror = () => {
          reject(new Error('文件读取错误'));
        };
        
        reader.readAsText(file);
      }
    });
  };

  // 文件类型图标映射
  const getFileIcon = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'doc':
      case 'docx':
        return <FaFileWord className="text-blue-500" />;
      case 'txt':
        return <FaFileAlt className="text-gray-500" />;
      case 'csv':
        return <FaFileCsv className="text-green-500" />;
      default:
        return <FaFileAlt className="text-gray-500" />;
    }
  };

  // 处理文本分析请求
  const handleProcessText = async () => {
    if (!inputText.trim()) {
      setError('请输入要处理的文本或上传文档');
      return;
    }

    setLoading(true);
    setError('');
    setResult('');

    try {
      console.log('发送请求到 /api/analyze, 类型:', processType);
      console.log('文本长度:', inputText.length);
      
      // 添加30秒超时
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      
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
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        // 打印原始响应信息
        console.log('API响应状态:', response.status, response.statusText);
        console.log('API响应头:', Object.fromEntries(response.headers.entries()));
        
        let responseText = '';
        try {
          // 先尝试获取原始文本
          responseText = await response.text();
          console.log('API原始响应:', responseText);
          
          // 检查响应文本是否为空
          if (!responseText || responseText.trim() === '') {
            console.error('API返回的响应文本为空');
            throw new Error('服务器返回了空响应，请检查服务器日志');
          }
          
          // 尝试解析为JSON
          let data;
          try {
            data = JSON.parse(responseText);
          } catch (jsonError) {
            console.error('JSON解析错误:', jsonError);
            console.error('无法解析的响应内容:', responseText);
            throw new Error(`服务器响应无法解析为JSON: ${responseText.substring(0, 100)}...`);
          }
          
          // 检查解析后的数据是否为空对象
          if (data && Object.keys(data).length === 0) {
            console.error('API返回了空对象:', data);
            throw new Error('服务器返回了空对象，请检查OpenRouter API配置');
          }
          
          if (!response.ok) {
            // 记录更多响应信息，帮助调试
            console.error('API响应错误:', {
              status: response.status,
              statusText: response.statusText,
              data: data || {},
              url: response.url
            });
            
            // 如果有详细错误信息，则包含它
            let errorMsg = data?.error || `处理请求时出错 (${response.status}: ${response.statusText})`;
            if (data?.details) {
              errorMsg += `\n\n详细信息: ${data.details}`;
            }
            
            throw new Error(errorMsg);
          }

          if (!data || !data.content) {
            console.error('API返回的内容为空或格式不正确:', data);
            // 如果有详细错误信息，则包含它
            let errorMsg = 'API返回的内容为空或格式不正确';
            if (data?.details) {
              errorMsg += `\n\n详细信息: ${data.details}`;
            }
            throw new Error(errorMsg);
          }

          setResult(data.content);
        } catch (parseError: any) {
          console.error('响应数据处理错误:', parseError);
          console.error('响应内容:', responseText);
          
          if (parseError.message.includes('JSON')) {
            // 如果是JSON解析错误，返回带有原始响应文本的错误
            throw new Error(`无法解析API响应 (状态码: ${response.status}): ${parseError.message}. 响应内容: ${responseText.substring(0, 100)}...`);
          } else {
            throw new Error(`API响应处理错误 (状态码: ${response.status}): ${parseError.message}`);
          }
        }
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        if (fetchError.name === 'AbortError') {
          console.error('请求超时，已终止');
          throw new Error('API请求超时，请稍后重试或尝试较短的文本');
        }
        throw fetchError;
      }
    } catch (err) {
      console.error('请求处理错误:', err);
      // 显示更详细的错误信息
      if (err instanceof Error) {
        // 增强错误显示
        const errorMessage = err.message || '未知错误';
        const errorName = err.name || 'Error';
        setError(`处理失败: [${errorName}] ${errorMessage}`);
        
        // 如果错误信息中包含"OpenRouter API"，提供更具体的建议
        if (errorMessage.includes('OpenRouter') || errorMessage.includes('API')) {
          setError(`处理失败: [${errorName}] ${errorMessage}\n\n可能是API密钥问题，请联系管理员检查API配置。`);
        }
      } else if (err === null || err === undefined) {
        setError('处理失败，发生了未知错误（null/undefined）');
      } else if (typeof err === 'object') {
        setError(`处理失败，错误详情: ${JSON.stringify(err)}`);
      } else {
        setError(`处理失败，服务器未返回错误详情: ${String(err)}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // 配置 dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/csv': ['.csv'],
      'text/markdown': ['.md', '.markdown'],
    },
    maxFiles: 1,
    maxSize: 10485760, // 10MB
    disabled: isLibraryLoading, // 当库正在加载时禁用上传
  });

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
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="inputText" className="block text-gray-700 dark:text-gray-300 font-medium">
                  输入文本
                </label>
                {fileName && (
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <span className="mr-2">已上传:</span>
                    <span className="flex items-center">
                      {getFileIcon(fileName)}
                      <span className="ml-1">{fileName}</span>
                    </span>
                    {processingStatus ? (
                      <span className="ml-3 flex items-center text-xs">
                        <FaSpinner className="animate-spin mr-1 text-primary" />
                        {processingStatus}
                      </span>
                    ) : (
                      <>
                        <button 
                          onClick={() => {
                            setShowPreview(!showPreview);
                          }}
                          className="ml-3 text-primary text-xs hover:underline"
                        >
                          {showPreview ? '隐藏预览' : '显示预览'}
                        </button>
                        <button 
                          className="ml-2 text-red-500 hover:text-red-700"
                          onClick={() => {
                            setFileName('');
                            setInputText('');
                            setShowPreview(false);
                          }}
                        >
                          ×
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
              
              <div 
                {...getRootProps()} 
                className={`border-2 border-dashed rounded-lg p-4 mb-3 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${isLibraryLoading ? 'opacity-70 cursor-not-allowed' : ''} ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 dark:border-gray-600'}`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center py-2">
                  <FaFileUpload className="text-gray-400 text-2xl mb-2" />
                  {fileLoading ? (
                    <div className="flex items-center">
                      <FaSpinner className="animate-spin mr-2" />
                      <span>{processingStatus || '文件处理中...'}</span>
                    </div>
                  ) : isLibraryLoading ? (
                    <div className="flex items-center">
                      <FaSpinner className="animate-spin mr-2" />
                      <span>正在加载文档处理功能...</span>
                    </div>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400">
                      {isDragActive ? '释放文件以上传' : '点击或拖放文件到这里上传'}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    支持 TXT, DOCX, CSV, MD 格式 (最大10MB)
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
                    注：旧版Word(.doc)文件需手动复制内容，推荐使用.docx格式
                  </p>
                </div>
              </div>
              
              {fileName && showPreview && (
                <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">文件内容预览</h4>
                    <button 
                      className="text-xs text-gray-500 hover:text-gray-700"
                      onClick={() => setShowPreview(false)}
                    >
                      关闭
                    </button>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 max-h-40 overflow-y-auto whitespace-pre-line">
                    {previewText}
                  </div>
                </div>
              )}
              
              <textarea
                id="inputText"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={10}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                placeholder="请输入要处理的学术文本或上传文档..."
              ></textarea>
            </div>

            <div className="mb-6">
              <button
                onClick={handleProcessText}
                disabled={loading}
                className="btn btn-primary w-full"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <FaSpinner className="animate-spin mr-2" />
                    处理中...
                  </span>
                ) : '开始处理'}
              </button>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
                <p className="mb-2 font-semibold">错误信息:</p>
                <p className="whitespace-pre-line">{error}</p>
                <p className="mt-4 text-sm">
                  <button 
                    onClick={() => {
                      // 添加测试处理
                      setInputText("测试服务连接");
                      setProcessType("summarize");
                    }}
                    className="underline text-red-600 hover:text-red-800"
                  >
                    尝试发送测试请求
                  </button>
                  {' | '}
                  <button 
                    onClick={() => window.location.reload()}
                    className="underline text-red-600 hover:text-red-800"
                  >
                    刷新页面
                  </button>
                </p>
              </div>
            )}

            {result && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">处理结果</h3>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-gray-800 dark:text-gray-200 whitespace-pre-line">
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