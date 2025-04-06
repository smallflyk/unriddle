import { NextRequest, NextResponse } from 'next/server';
import { analyzePdfContent } from '@/app/services/openai';

export async function POST(request: NextRequest) {
  try {
    // 解析请求数据
    const body = await request.json();
    const { pdfText } = body;

    // 验证输入
    if (!pdfText || typeof pdfText !== 'string') {
      return NextResponse.json(
        { error: '缺少PDF文本或格式不正确' },
        { status: 400 }
      );
    }

    // 调用OpenAI服务分析PDF内容
    const result = await analyzePdfContent(pdfText);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || '分析PDF内容时出错' },
        { status: 500 }
      );
    }

    // 返回处理结果
    return NextResponse.json({
      content: result.content,
      success: true
    });
  } catch (error) {
    console.error('API处理错误:', error);
    return NextResponse.json(
      { error: '服务器处理请求时出错' },
      { status: 500 }
    );
  }
} 