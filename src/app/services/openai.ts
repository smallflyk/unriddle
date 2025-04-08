import OpenAI from 'openai';

// 获取API密钥
const apiKey = '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';

// 添加调试信息
console.log('使用的API密钥长度:', apiKey.length);

// 根据官方文档创建OpenAI实例
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: apiKey,
  defaultHeaders: {
    'HTTP-Referer': 'https://unriddle.ai', // Site URL for rankings on openrouter.ai
    'X-Title': 'Unriddle Academic Assistant', // Site title for rankings on openrouter.ai
  },
  timeout: 30000, // 设置30秒超时
});

// 打印配置状态，帮助调试
console.log('API配置状态:', {
  apiKeySet: !!apiKey,
  apiKeyLength: apiKey.length,
  environment: process.env.NODE_ENV,
  isServer: typeof window === 'undefined',
});

// 文本处理类型
export type TextProcessingType = 
  | 'summarize' // 摘要生成
  | 'analyze' // 内容分析
  | 'extract-key-points' // 提取关键点
  | 'generate-questions' // 生成问题
  | 'literature-review'; // 文献综述

// 定义响应接口
export interface AIResponse {
  content: string;
  success: boolean;
  error?: string;
}

// 语言检测函数 - 检测输入文本的主要语言
function detectLanguage(text: string): 'en' | 'zh' | 'other' {
  // 简单的语言检测实现
  // 检查文本中的中文字符比例
  const chineseRegex = /[\u4e00-\u9fa5]/g;
  const chineseChars = text.match(chineseRegex) || [];
  const chineseRatio = chineseChars.length / text.length;
  
  // 如果中文字符比例超过15%，判断为中文
  if (chineseRatio > 0.15) {
    return 'zh';
  }
  
  // 检查是否为英文主导
  const englishRegex = /[a-zA-Z]/g;
  const englishChars = text.match(englishRegex) || [];
  const englishRatio = englishChars.length / text.length;
  
  // 如果英文字符比例超过30%，判断为英文
  if (englishRatio > 0.3) {
    return 'en';
  }
  
  // 默认返回英文
  return 'en';
}

/**
 * 处理文本 - 根据不同的处理类型调用AI进行处理
 * @param text 要处理的文本
 * @param type 处理类型
 * @returns 处理结果
 */
export async function processText(text: string, type: TextProcessingType): Promise<AIResponse> {
  try {
    // 首先检查API密钥是否存在
    if (!apiKey) {
      console.error('API调用失败: 未设置API密钥');
      return {
        content: '',
        success: false,
        error: 'API密钥未设置，请检查环境配置'
      };
    }
    
    // 检查文本长度，太长可能导致超时或错误
    if (text.length > 25000) {
      console.warn('文本长度超过25000字符，将被截断');
      text = text.substring(0, 25000) + '...';
    }
    
    // 检测输入文本的语言
    const inputLanguage = detectLanguage(text);
    console.log('检测到的输入语言:', inputLanguage);
    
    // 根据处理类型构建不同的提示词
    let prompt = '';
    
    // 根据检测到的语言决定使用中文或英文提示
    if (inputLanguage === 'zh') {
      // 中文提示
      switch(type) {
        case 'summarize':
          prompt = `请总结以下学术文本，提取核心观点和研究发现，使用清晰简洁的语言，请保持学术严谨性。请用中文回答：\n\n${text}`;
          break;
        case 'analyze':
          prompt = `请分析以下学术文本的方法论、研究设计、数据来源、结论和潜在局限性。请用中文回答：\n\n${text}`;
          break;
        case 'extract-key-points':
          prompt = `请从以下学术文本中提取关键点、核心概念和重要发现，以条目形式列出。请用中文回答：\n\n${text}`;
          break;
        case 'generate-questions':
          prompt = `基于以下学术文本，请生成5-8个可以指导进一步研究或深入探索的深度研究问题。请用中文回答：\n\n${text}`;
          break;
        case 'literature-review':
          prompt = `基于以下学术内容，请生成一个简短的文献综述段落，概述当前研究领域的状态、主要发现和现有研究差距。请用中文回答：\n\n${text}`;
          break;
        default:
          prompt = `请分析以下学术文本并提供见解。请用中文回答：\n\n${text}`;
      }
    } else {
      // 英文提示
      switch(type) {
        case 'summarize':
          prompt = `Please summarize the following academic text, extract core viewpoints and research findings, using clear and concise language. Please maintain academic rigor and respond in English:\n\n${text}`;
          break;
        case 'analyze':
          prompt = `Please analyze the methodology, research design, data sources, conclusions, and potential limitations of the following academic text. Please respond in English:\n\n${text}`;
          break;
        case 'extract-key-points':
          prompt = `Please extract key points, core concepts, and important findings from the following academic text, listed as items. Please respond in English:\n\n${text}`;
          break;
        case 'generate-questions':
          prompt = `Based on the following academic text, please generate 5-8 in-depth research questions that could guide further research or deeper exploration. Please respond in English:\n\n${text}`;
          break;
        case 'literature-review':
          prompt = `Based on the following academic content, please generate a brief literature review paragraph, outlining the current state of the research field, main findings, and existing research gaps. Please respond in English:\n\n${text}`;
          break;
        default:
          prompt = `Please analyze the following academic text and provide insights. Please respond in English:\n\n${text}`;
      }
    }

    console.log('处理文本请求类型:', type);
    console.log('文本长度:', text.length);
    console.log('API KEY状态:', apiKey ? '已设置' : '未设置');
    
    // 用于测试的简单模型 - 当API出现问题时返回测试响应
    if (text.length < 50 && text.includes('测试')) {
      console.log('检测到测试请求，返回测试响应');
      return {
        content: `This is a test response. Your input text is: "${text}". Processing type: ${type}. This indicates that the frontend and API routes are working properly, but there may be connection issues with the OpenRouter API.`,
        success: true
      };
    }
    
    // 尝试使用备用模型
    let modelToUse = 'openai/gpt-4o';
    // 如果文本很短，使用更快的模型进行测试
    if (text.length < 200) {
      modelToUse = 'openai/gpt-3.5-turbo';
    }
    
    try {
      console.log(`尝试使用模型: ${modelToUse}`);
      console.log('API请求开始时间:', new Date().toISOString());
      
      // 调用OpenAI API - 完全按照官方文档示例
      const completion = await openai.chat.completions.create({
        model: modelToUse,
        messages: [
          {
            role: 'system',
            content: inputLanguage === 'zh' 
              ? '你是一位专业的学术研究助手，擅长分析和处理学术文本。请提供客观、准确和深入的答案，并保持与输入文本相同的语言风格和类型。'
              : 'You are a professional academic research assistant, skilled in analyzing and processing academic texts. Please provide objective, accurate, and in-depth answers, and maintain the same language style and type as the input text.'
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000
      });
      
      console.log('API请求结束时间:', new Date().toISOString());
      console.log('API返回结果状态:', completion.choices ? '成功' : '失败');
      console.log('API返回结果详情:', JSON.stringify(completion, null, 2));

      if (!completion.choices || completion.choices.length === 0) {
        throw new Error('API返回的结果不包含任何选项');
      }

      const result = completion.choices[0].message.content;
      
      if (!result) {
        throw new Error('API返回的内容为空');
      }

      // 返回处理结果
      return {
        content: result,
        success: true
      };
    } catch (apiError) {
      console.error(`使用模型 ${modelToUse} 调用失败:`, apiError);
      
      // 增强错误日志，记录更多信息
      if (apiError instanceof Error) {
        console.error('错误名称:', apiError.name);
        console.error('错误消息:', apiError.message);
        console.error('错误堆栈:', apiError.stack);
        
        // 记录更多的错误属性
        const errorObj = apiError as any;
        if (errorObj.response) {
          console.error('API错误响应:', JSON.stringify(errorObj.response, null, 2));
        }
        if (errorObj.status) {
          console.error('API错误状态码:', errorObj.status);
        }
      } else {
        console.error('未知类型的API错误:', JSON.stringify(apiError, null, 2));
      }
      
      // 如果使用主模型失败，尝试备用模型
      if (modelToUse === 'openai/gpt-4o') {
        console.log('尝试使用备用模型 gpt-3.5-turbo');
        modelToUse = 'openai/gpt-3.5-turbo';
        
        try {
          const backupCompletion = await openai.chat.completions.create({
            model: modelToUse,
            messages: [
              {
                role: 'system',
                content: inputLanguage === 'zh' 
                  ? '你是一位专业的学术研究助手，擅长分析和处理学术文本。请提供客观、准确和深入的答案，并保持与输入文本相同的语言风格和类型。'
                  : 'You are a professional academic research assistant, skilled in analyzing and processing academic texts. Please provide objective, accurate, and in-depth answers, and maintain the same language style and type as the input text.'
              },
              {
                role: 'user',
                content: prompt,
              },
            ],
            temperature: 0.7,
            max_tokens: 2000,
          });
          
          console.log('备用API请求完成，结果:', JSON.stringify(backupCompletion, null, 2));
          
          if (!backupCompletion.choices || backupCompletion.choices.length === 0) {
            throw new Error('备用API返回的结果不包含任何选项');
          }

          const backupResult = backupCompletion.choices[0].message.content;
          
          if (!backupResult) {
            throw new Error('备用API返回的内容为空');
          }

          return {
            content: backupResult,
            success: true
          };
        } catch (backupError) {
          console.error('备用模型也调用失败:', backupError);
          
          // 增强备用错误日志
          if (backupError instanceof Error) {
            console.error('备用错误名称:', backupError.name);
            console.error('备用错误消息:', backupError.message);
            console.error('备用错误堆栈:', backupError.stack);
            
            // 记录备用错误的其他属性
            const errorObj = backupError as any;
            if (errorObj.response) {
              console.error('备用API错误响应:', JSON.stringify(errorObj.response, null, 2));
            }
            if (errorObj.status) {
              console.error('备用API错误状态码:', errorObj.status);
            }
          }
          
          // 提供明确的错误信息
          return {
            content: '',
            success: false,
            error: backupError instanceof Error 
                  ? `备用API调用失败: ${backupError.message}` 
                  : '备用API调用失败，请检查网络连接或API配置'
          };
        }
      } else {
        // 提供明确的错误信息
        return {
          content: '',
          success: false,
          error: apiError instanceof Error 
                ? `API调用失败: ${apiError.message}` 
                : '未知API错误，请检查网络连接或API配置'
        };
      }
    }
  } catch (error) {
    console.error('OpenAI API调用失败:', error);
    // 添加更详细的错误日志
    if (error instanceof Error) {
      console.error('错误详情:', error.message);
      console.error('错误类型:', error.name);
      console.error('错误堆栈:', error.stack);
    } else {
      console.error('未知类型错误:', error);
    }
    
    // 构建详细的错误消息
    let errorMessage = '调用AI处理服务失败';
    
    if (error instanceof Error) {
      // 处理常见的错误类型
      if (error.message.includes('401') || error.message.includes('auth')) {
        errorMessage = 'API身份验证失败，请检查API密钥是否正确设置';
        console.error('身份验证错误，API密钥状态:', !!apiKey);
      } else if (error.message.includes('timeout')) {
        errorMessage = '请求超时，服务器响应时间过长';
      } else if (error.message.includes('network')) {
        errorMessage = '网络错误，请检查网络连接';
      } else if (error.message.includes('rate limit')) {
        errorMessage = 'API调用频率限制，请稍后再试';
      } else if (error.message.includes('api key')) {
        errorMessage = 'API密钥无效或已过期';
      } else {
        errorMessage = `处理失败: ${error.message}`;
      }
    } else if (typeof error === 'object' && error !== null) {
      // 尝试从对象中提取信息
      errorMessage = `处理失败: ${JSON.stringify(error)}`;
    }
    
    return {
      content: '',
      success: false,
      error: errorMessage
    };
  }
}

/**
 * 生成研究建议
 * @param researchTopic 研究主题
 * @returns 研究建议
 */
export async function generateResearchSuggestions(researchTopic: string): Promise<AIResponse> {
  try {
    // 首先检查API密钥是否存在
    if (!apiKey) {
      console.error('API调用失败: 未设置API密钥');
      return {
        content: '',
        success: false,
        error: 'API密钥未设置，请检查环境配置'
      };
    }
    
    console.log('生成研究建议，主题:', researchTopic);
    
    // 尝试使用备用模型
    let modelToUse = 'openai/gpt-4o';
    
    try {
      const completion = await openai.chat.completions.create({
        model: modelToUse,
        messages: [
          {
            role: 'system',
            content: '你是一个专业的学术研究顾问，擅长提供研究方向建议和方法论指导。'
          },
          {
            role: 'user',
            content: `我正在研究"${researchTopic}"这个主题。请提供以下建议：
1. 这个领域最新的研究动向
2. 5个可能的研究问题
3. 推荐的研究方法和数据收集策略
4. 潜在挑战和应对策略`,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      if (!completion.choices || completion.choices.length === 0) {
        throw new Error('API返回的结果不包含任何选项');
      }

      const result = completion.choices[0].message.content;
      
      if (!result) {
        throw new Error('API返回的内容为空');
      }

      return {
        content: result,
        success: true
      };
    } catch (apiError) {
      console.error(`使用模型 ${modelToUse} 调用失败:`, apiError);
      
      // 如果使用主模型失败，尝试备用模型
      if (modelToUse === 'openai/gpt-4o') {
        console.log('尝试使用备用模型 gpt-3.5-turbo');
        modelToUse = 'openai/gpt-3.5-turbo';
        
        try {
          const backupCompletion = await openai.chat.completions.create({
            model: modelToUse,
            messages: [
              {
                role: 'system',
                content: '你是一个专业的学术研究顾问，擅长提供研究方向建议和方法论指导。'
              },
              {
                role: 'user',
                content: `我正在研究"${researchTopic}"这个主题。请提供以下建议：
1. 这个领域最新的研究动向
2. 5个可能的研究问题
3. 推荐的研究方法和数据收集策略
4. 潜在挑战和应对策略`,
              },
            ],
            temperature: 0.7,
            max_tokens: 2000,
          });
          
          if (!backupCompletion.choices || backupCompletion.choices.length === 0) {
            throw new Error('备用API返回的结果不包含任何选项');
          }

          const backupResult = backupCompletion.choices[0].message.content;
          
          if (!backupResult) {
            throw new Error('备用API返回的内容为空');
          }

          return {
            content: backupResult,
            success: true
          };
        } catch (backupError) {
          console.error('备用模型也调用失败:', backupError);
          throw apiError; // 抛出原始错误
        }
      } else {
        throw apiError;
      }
    }
  } catch (error) {
    console.error('生成研究建议失败:', error);
    
    // 构建详细的错误消息
    let errorMessage = '生成研究建议失败';
    
    if (error instanceof Error) {
      console.error('错误详情:', error.message);
      console.error('错误类型:', error.name);
      console.error('错误堆栈:', error.stack);
      
      // 处理常见的错误类型
      if (error.message.includes('timeout')) {
        errorMessage = '请求超时，服务器响应时间过长';
      } else if (error.message.includes('network')) {
        errorMessage = '网络错误，请检查网络连接';
      } else if (error.message.includes('rate limit')) {
        errorMessage = 'API调用频率限制，请稍后再试';
      } else if (error.message.includes('api key')) {
        errorMessage = 'API密钥无效或已过期';
      } else {
        errorMessage = `生成失败: ${error.message}`;
      }
    }
    
    return {
      content: '',
      success: false,
      error: errorMessage
    };
  }
}

/**
 * 分析PDF内容（文本形式）
 * @param pdfText PDF提取的文本内容
 * @returns 分析结果
 */
export async function analyzePdfContent(pdfText: string): Promise<AIResponse> {
  try {
    // 首先检查API密钥是否存在
    if (!apiKey) {
      console.error('API调用失败: 未设置API密钥');
      return {
        content: '',
        success: false,
        error: 'API密钥未设置，请检查环境配置'
      };
    }
    
    // 如果文本太长，可能需要截断或分段处理
    const truncatedText = pdfText.length > 8000 ? pdfText.substring(0, 8000) + '...' : pdfText;
    
    console.log('分析PDF内容，文本长度:', truncatedText.length);
    
    // 尝试使用备用模型
    let modelToUse = 'openai/gpt-4o';
    
    try {
      const completion = await openai.chat.completions.create({
        model: modelToUse,
        messages: [
          {
            role: 'system',
            content: '你是一个专业的学术文献分析专家，擅长分析研究论文并提取关键信息。'
          },
          {
            role: 'user',
            content: `请分析以下从PDF提取的学术文本，并提供：
1. 研究目的和问题
2. 使用的方法论
3. 主要研究发现
4. 结论和建议
5. 论文的优势和局限性
6. 与其他研究的关系

文本内容：
${truncatedText}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      if (!completion.choices || completion.choices.length === 0) {
        throw new Error('API返回的结果不包含任何选项');
      }

      const result = completion.choices[0].message.content;
      
      if (!result) {
        throw new Error('API返回的内容为空');
      }

      return {
        content: result,
        success: true
      };
    } catch (apiError) {
      console.error(`使用模型 ${modelToUse} 调用失败:`, apiError);
      
      // 如果使用主模型失败，尝试备用模型
      if (modelToUse === 'openai/gpt-4o') {
        console.log('尝试使用备用模型 gpt-3.5-turbo');
        modelToUse = 'openai/gpt-3.5-turbo';
        
        try {
          const backupCompletion = await openai.chat.completions.create({
            model: modelToUse,
            messages: [
              {
                role: 'system',
                content: '你是一个专业的学术文献分析专家，擅长分析研究论文并提取关键信息。'
              },
              {
                role: 'user',
                content: `请分析以下从PDF提取的学术文本，并提供：
1. 研究目的和问题
2. 使用的方法论
3. 主要研究发现
4. 结论和建议
5. 论文的优势和局限性
6. 与其他研究的关系

文本内容：
${truncatedText}`,
              },
            ],
            temperature: 0.7,
            max_tokens: 2000,
          });
          
          if (!backupCompletion.choices || backupCompletion.choices.length === 0) {
            throw new Error('备用API返回的结果不包含任何选项');
          }

          const backupResult = backupCompletion.choices[0].message.content;
          
          if (!backupResult) {
            throw new Error('备用API返回的内容为空');
          }

          return {
            content: backupResult,
            success: true
          };
        } catch (backupError) {
          console.error('备用模型也调用失败:', backupError);
          throw apiError; // 抛出原始错误
        }
      } else {
        throw apiError;
      }
    }
  } catch (error) {
    console.error('分析PDF内容失败:', error);
    
    // 构建详细的错误消息
    let errorMessage = '分析PDF内容失败';
    
    if (error instanceof Error) {
      console.error('错误详情:', error.message);
      console.error('错误类型:', error.name);
      console.error('错误堆栈:', error.stack);
      
      // 处理常见的错误类型
      if (error.message.includes('timeout')) {
        errorMessage = '请求超时，服务器响应时间过长';
      } else if (error.message.includes('network')) {
        errorMessage = '网络错误，请检查网络连接';
      } else if (error.message.includes('rate limit')) {
        errorMessage = 'API调用频率限制，请稍后再试';
      } else if (error.message.includes('api key')) {
        errorMessage = 'API密钥无效或已过期';
      } else {
        errorMessage = `分析失败: ${error.message}`;
      }
    }
    
    return {
      content: '',
      success: false,
      error: errorMessage
    };
  }
}

export default openai; 