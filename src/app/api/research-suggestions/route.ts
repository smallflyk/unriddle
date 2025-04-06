import { NextRequest, NextResponse } from 'next/server';
import { generateResearchSuggestions } from '@/app/services/openai';

export async function POST(request: NextRequest) {
  try {
    // 解析请求数据
    const body = await request.json();
    const { topic } = body;

    // 验证输入
    if (!topic || typeof topic !== 'string') {
      return NextResponse.json(
        { error: '缺少研究主题或格式不正确' },
        { status: 400 }
      );
    }

    // 调用OpenAI服务生成研究建议
    const result = await generateResearchSuggestions(topic);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || '生成研究建议时出错' },
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