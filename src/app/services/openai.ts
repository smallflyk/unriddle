import OpenAI from 'openai';

// 创建OpenAI实例
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY || '',
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://unriddle.ai',
    'X-Title': process.env.NEXT_PUBLIC_SITE_NAME || 'Unriddle学术研究助手',
  },
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

/**
 * 处理文本 - 根据不同的处理类型调用AI进行处理
 * @param text 要处理的文本
 * @param type 处理类型
 * @returns 处理结果
 */
export async function processText(text: string, type: TextProcessingType): Promise<AIResponse> {
  try {
    // 根据处理类型构建不同的提示词
    let prompt = '';
    
    switch(type) {
      case 'summarize':
        prompt = `请对以下学术文本进行摘要，提取核心观点和研究发现，用简洁明了的语言表达。请保持学术严谨性：\n\n${text}`;
        break;
      case 'analyze':
        prompt = `请分析以下学术文本的方法论、研究设计、数据来源、结论以及潜在局限性：\n\n${text}`;
        break;
      case 'extract-key-points':
        prompt = `请从以下学术文本中提取关键点、核心概念和重要发现，以条目形式列出：\n\n${text}`;
        break;
      case 'generate-questions':
        prompt = `请基于以下学术文本生成5-8个深入的研究问题，这些问题可以指导进一步的研究或深入探讨：\n\n${text}`;
        break;
      case 'literature-review':
        prompt = `请基于以下学术内容，生成一个简短的文献综述段落，概述研究领域的现状、主要发现和存在的研究缺口：\n\n${text}`;
        break;
      default:
        prompt = `请分析以下学术文本并提供见解：\n\n${text}`;
    }

    // 调用OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-4o',
      messages: [
        {
          role: 'system',
          content: '你是一个专业的学术研究助手，擅长分析和处理学术文本。请提供客观、准确、有深度的回答。'
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // 返回处理结果
    return {
      content: completion.choices[0].message.content || '无法生成回应',
      success: true
    };
  } catch (error) {
    console.error('OpenAI API调用失败:', error);
    return {
      content: '',
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
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
    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-4o',
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
    });

    return {
      content: completion.choices[0].message.content || '无法生成研究建议',
      success: true
    };
  } catch (error) {
    console.error('生成研究建议失败:', error);
    return {
      content: '',
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
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
    // 如果文本太长，可能需要截断或分段处理
    const truncatedText = pdfText.length > 8000 ? pdfText.substring(0, 8000) + '...' : pdfText;
    
    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-4o',
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
    });

    return {
      content: completion.choices[0].message.content || '无法分析PDF内容',
      success: true
    };
  } catch (error) {
    console.error('分析PDF内容失败:', error);
    return {
      content: '',
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    };
  }
}

export default openai; 