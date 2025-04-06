import OpenAI from 'openai';

// 获取API密钥
const apiKey = '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';

// 添加调试信息
console.log('Analyze服务 - 使用的API密钥长度:', apiKey.length);

// 根据官方文档创建OpenAI实例
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: apiKey,
  defaultHeaders: {
    'HTTP-Referer': 'https://unriddle.ai', // Site URL for rankings on openrouter.ai
    'X-Title': 'Unriddle Academic Assistant', // Site title for rankings on openrouter.ai
  },
});

// 打印配置状态，帮助调试
console.log('Analyze服务API配置状态:', {
  apiKeySet: !!apiKey,
  apiKeyLength: apiKey.length,
});

// 定义响应接口
interface AIResponse {
  content: string;
  success: boolean;
  error?: string;
}

// 语言检测函数 - 复用于文本分析
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
 * 分析文本内容
 * @param text 要分析的文本
 * @param type 分析类型 (basic 或 comprehensive)
 * @returns 分析结果
 */
export async function analyzeText(text: string, type: 'basic' | 'comprehensive'): Promise<AIResponse> {
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
    
    // 如果文本太长，可能需要截断
    const truncatedText = text.length > 8000 ? text.substring(0, 8000) + '...' : text;
    
    // 检测输入文本的语言
    const inputLanguage = detectLanguage(text);
    console.log('检测到的输入语言:', inputLanguage);
    
    console.log(`开始分析文本, 类型: ${type}, 文本长度: ${truncatedText.length}`);
    
    // 尝试使用主模型
    let modelToUse = 'openai/gpt-4o';
    
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
              ? (type === 'basic' 
                ? '你是一位专业的文本分析助手，擅长从文本中提取关键信息和主题。请保持回复语言与输入文本语言一致。'
                : '你是一位高级文本分析专家，擅长深入分析文本内容，提供全面的见解和建议。请保持回复语言与输入文本语言一致。')
              : (type === 'basic' 
                ? 'You are a professional text analysis assistant, adept at extracting key information and themes from text. Maintain response language consistent with the input text language.'
                : 'You are a senior text analysis expert, adept at deeply analyzing text content to provide comprehensive insights and recommendations. Maintain response language consistent with the input text language.')
          },
          {
            role: 'user',
            content: inputLanguage === 'zh'
              ? (type === 'basic'
                ? `请对以下文本进行基本分析，提供：
1. 主要主题和关键点
2. 文本类型和目的
3. 主要观点和证据
4. 文本结构分析

文本内容：
${truncatedText}`
                : `请对以下文本进行全面深入的分析，提供：
1. 主要主题和关键点
2. 文本类型、目的和受众
3. 主要观点、证据和逻辑结构
4. 语言和修辞分析
5. 潜在的偏见或假设
6. 文本优势和局限性
7. 改进建议和替代视角
8. 与相关领域的联系

文本内容：
${truncatedText}`)
              : (type === 'basic'
                ? `Please perform basic analysis on the following text, providing:
1. Main themes and key points
2. Text type and purpose
3. Main points and evidence
4. Text structure analysis

Text content:
${truncatedText}`
                : `Please perform comprehensive and in-depth analysis on the following text, providing:
1. Main themes and key points
2. Text type, purpose, and audience
3. Main points, evidence, and logical structure
4. Language and rhetorical analysis
5. Potential biases or assumptions
6. Text strengths and limitations
7. Improvement suggestions and alternative perspectives
8. Connection to related fields

Text content:
${truncatedText}`)
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });
      
      console.log('API请求结束时间:', new Date().toISOString());
      console.log('API返回结果状态:', completion.choices ? '成功' : '失败');

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
                content: inputLanguage === 'zh'
                  ? (type === 'basic' 
                    ? '你是一位专业的文本分析助手，擅长从文本中提取关键信息和主题。请保持回复语言与输入文本语言一致。'
                    : '你是一位高级文本分析专家，擅长深入分析文本内容，提供全面的见解和建议。请保持回复语言与输入文本语言一致。')
                  : (type === 'basic' 
                    ? 'You are a professional text analysis assistant, adept at extracting key information and themes from text. Maintain response language consistent with the input text language.'
                    : 'You are a senior text analysis expert, adept at deeply analyzing text content to provide comprehensive insights and recommendations. Maintain response language consistent with the input text language.')
              },
              {
                role: 'user',
                content: inputLanguage === 'zh'
                  ? (type === 'basic'
                    ? `请对以下文本进行基本分析，提供：
1. 主要主题和关键点
2. 文本类型和目的
3. 主要观点和证据
4. 文本结构分析

文本内容：
${truncatedText}`
                    : `请对以下文本进行全面深入的分析，提供：
1. 主要主题和关键点
2. 文本类型、目的和受众
3. 主要观点、证据和逻辑结构
4. 语言和修辞分析
5. 潜在的偏见或假设
6. 文本优势和局限性
7. 改进建议和替代视角
8. 与相关领域的联系

文本内容：
${truncatedText}`)
                  : (type === 'basic'
                    ? `Please perform basic analysis on the following text, providing:
1. Main themes and key points
2. Text type and purpose
3. Main points and evidence
4. Text structure analysis

Text content:
${truncatedText}`
                    : `Please perform comprehensive and in-depth analysis on the following text, providing:
1. Main themes and key points
2. Text type, purpose, and audience
3. Main points, evidence, and logical structure
4. Language and rhetorical analysis
5. Potential biases or assumptions
6. Text strengths and limitations
7. Improvement suggestions and alternative perspectives
8. Connection to related fields

Text content:
${truncatedText}`)
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
    console.error('分析文本失败:', error);
    
    // 构建详细的错误消息
    let errorMessage = '分析文本失败';
    
    if (error instanceof Error) {
      console.error('错误详情:', error.message);
      console.error('错误类型:', error.name);
      console.error('错误堆栈:', error.stack);
      
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