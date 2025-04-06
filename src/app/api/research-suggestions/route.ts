import { NextRequest, NextResponse } from 'next/server';
import { generateResearchSuggestions } from '../../services/openai';

export async function POST(request: NextRequest) {
  try {
    // 验证请求方法
    if (request.method !== 'POST') {
      return NextResponse.json(
        { error: '只支持POST请求方法' },
        { status: 405 }
      );
    }
    
    // 解析请求数据
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('请求数据解析错误:', parseError);
      return NextResponse.json(
        { error: '无效的请求数据格式，请确保发送有效的JSON' },
        { status: 400 }
      );
    }
    
    const { topic } = body;

    // 验证输入
    if (!topic || typeof topic !== 'string') {
      return NextResponse.json(
        { error: '缺少研究主题或格式不正确' },
        { status: 400 }
      );
    }

    console.log(`研究建议请求开始，主题: ${topic}`);
    
    // 调用OpenAI服务生成研究建议
    const result = await generateResearchSuggestions(topic);

    if (!result.success) {
      console.error('生成研究建议失败:', result.error);
      return NextResponse.json(
        { error: result.error || '生成研究建议时出错' },
        { status: 500 }
      );
    }

    // 确保返回内容不为空
    if (!result.content || result.content.trim() === '') {
      console.error('API返回的内容为空');
      return NextResponse.json(
        { error: 'AI服务返回了空内容' },
        { status: 500 }
      );
    }

    console.log('研究建议生成成功完成');
    
    // 返回处理结果
    return NextResponse.json({
      content: result.content,
      success: true
    });
  } catch (error) {
    // 记录详细错误信息
    console.error('API处理错误:', error);
    let errorMessage = '服务器处理请求时出错';
    
    if (error instanceof Error) {
      console.error('错误类型:', error.name);
      console.error('错误详情:', error.message);
      console.error('错误堆栈:', error.stack);
      errorMessage = `服务器错误: ${error.message}`;
    }
    
    // 返回格式化的错误响应
    return NextResponse.json(
      { error: errorMessage, success: false },
      { status: 500 }
    );
  }
} 