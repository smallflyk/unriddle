import { NextRequest, NextResponse } from 'next/server';
import { processText, TextProcessingType } from '@/app/services/openai';

export async function POST(request: NextRequest) {
  try {
    // 解析请求数据
    const body = await request.json();
    const { text, type } = body;

    // 验证输入
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: '缺少文本或格式不正确' },
        { status: 400 }
      );
    }

    if (!type || !['summarize', 'analyze', 'extract-key-points', 'generate-questions', 'literature-review'].includes(type)) {
      return NextResponse.json(
        { error: '处理类型无效或缺失' },
        { status: 400 }
      );
    }

    // 调用OpenAI服务处理文本
    const result = await processText(text, type as TextProcessingType);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || '处理文本时出错' },
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