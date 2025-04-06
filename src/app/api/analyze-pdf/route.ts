import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

// 环境变量
const apiKey = process.env.OPENAI_API_KEY || '';
const openai = new OpenAI({
  apiKey,
});

// 类型定义
interface PdfAnalysisRequest {
  pdfText: string;
}

interface ApiResponse {
  content?: string;
  error?: string;
  success: boolean;
}

// 语言检测函数 - 复用于PDF分析
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

export async function POST(request: NextRequest) {
  console.log('接收到PDF分析请求');

  try {
    // 验证请求方法
    if (request.method !== 'POST') {
      return NextResponse.json(
        { error: '只支持POST请求方法', success: false },
        { status: 405 }
      );
    }

    // 解析请求数据
    let body: PdfAnalysisRequest;
    try {
      body = await request.json();
      console.log('请求数据解析成功', { textLength: body?.pdfText?.length || 0 });
    } catch (parseError) {
      console.error('请求数据解析错误:', parseError);
      return NextResponse.json(
        { error: '无效的请求数据格式，请确保发送有效的JSON', success: false },
        { status: 400 }
      );
    }

    const { pdfText } = body;

    // 验证输入
    if (!pdfText || typeof pdfText !== 'string') {
      return NextResponse.json(
        { error: '缺少PDF文本或格式不正确', success: false },
        { status: 400 }
      );
    }

    // 如果文本太长，返回错误
    if (pdfText.length > 50000) {
      return NextResponse.json(
        { error: '文本内容过长，请限制在50000字符以内', success: false },
        { status: 400 }
      );
    }

    // 检测PDF文本的语言
    const inputLanguage = detectLanguage(pdfText);
    console.log('检测到的PDF语言:', inputLanguage);

    // 截断文本以确保不超过API限制
    const truncatedText = pdfText.length > 25000 
      ? pdfText.substring(0, 25000) + '...' 
      : pdfText;

    // 根据检测到的语言选择提示词
    const prompt = inputLanguage === 'zh'
      ? `请分析以下PDF文档内容，提供文档的主要主题、关键观点、结构分析和重要结论。保持回复语言与文档语言一致：\n\n${truncatedText}`
      : `Please analyze the following PDF document content, providing the main themes, key points, structural analysis, and important conclusions. Maintain response language consistent with the document language:\n\n${truncatedText}`;

    // 调用OpenAI分析PDF内容
    try {
      const modelToUse = 'openai/gpt-4o';
      console.log(`尝试使用模型: ${modelToUse} 分析PDF内容`);
      
      const completion = await openai.chat.completions.create({
        model: modelToUse,
        messages: [
          {
            role: 'system',
            content: inputLanguage === 'zh'
              ? '你是一位专业的PDF文档分析助手，擅长分析学术和专业文档。请提供客观、准确和深入的分析，并保持与文档相同的语言。'
              : 'You are a professional PDF document analysis assistant, skilled at analyzing academic and professional documents. Please provide objective, accurate, and in-depth analysis, maintaining the same language as the document.'
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2500,
      });

      if (!completion.choices || completion.choices.length === 0) {
        throw new Error('API返回的结果不包含任何选项');
      }

      const result = completion.choices[0].message.content;
      
      if (!result) {
        throw new Error('API返回的内容为空');
      }

      // 返回PDF分析结果
      return NextResponse.json({
        content: result,
        success: true
      });
    } catch (apiError: any) {
      console.error('OpenAI API调用失败:', apiError);
      return NextResponse.json({
        error: `API错误: ${apiError.message || '未知错误'}`,
        success: false
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('PDF分析处理错误:', error);
    return NextResponse.json({
      error: `处理错误: ${error.message || '未知错误'}`,
      success: false
    }, { status: 500 });
  }
} 