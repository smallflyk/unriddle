import { NextRequest, NextResponse } from 'next/server';
import { processText, TextProcessingType } from '../../services/openai';

export async function POST(request: NextRequest) {
  // 记录API请求详情用于调试
  console.log('接收到分析请求', {
    url: request.url,
    method: request.method,
    headers: Object.fromEntries(request.headers.entries()),
  });
  
  try {
    // 验证请求方法
    if (request.method !== 'POST') {
      return NextResponse.json(
        { error: '只支持POST请求方法', success: false },
        { status: 405 }
      );
    }
    
    // 解析请求数据
    let body;
    try {
      body = await request.json();
      console.log('请求数据解析成功', { 
        textLength: body?.text?.length || 0,
        type: body?.type || '未指定'
      });
    } catch (parseError) {
      console.error('请求数据解析错误:', parseError);
      return NextResponse.json(
        { error: '无效的请求数据格式，请确保发送有效的JSON', success: false },
        { status: 400 }
      );
    }
    
    const { text, type } = body;

    // 验证输入
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: '缺少文本或格式不正确', success: false },
        { status: 400 }
      );
    }

    if (!type || !['summarize', 'analyze', 'extract-key-points', 'generate-questions', 'literature-review'].includes(type)) {
      return NextResponse.json(
        { error: '处理类型无效或缺失', success: false },
        { status: 400 }
      );
    }
    
    // 如果文本太长，返回错误
    if (text.length > 50000) {
      return NextResponse.json(
        { error: '文本内容过长，请限制在50000字符以内', success: false },
        { status: 400 }
      );
    }

    console.log(`API处理开始，类型: ${type}, 文本长度: ${text.length}`);
    
    // 临时解决方案：如果文本长度超过1000，可能是从文件上传的，返回一个测试响应
    if (text.length > 1000) {
      console.log('检测到长文本，使用临时解决方案');
      return NextResponse.json({
        content: `This is a test response. Your uploaded file is ${text.length} characters long. Processing type: ${type}.
        
The API service is currently being updated to fix character encoding issues. File processing functionality will be fully restored soon.
You can try using shorter text directly for testing, or try again later.`,
        success: true
      });
    }
    
    // 调用OpenAI服务处理文本
    try {
      const result = await processText(text, type as TextProcessingType);
      console.log('处理结果:', {
        success: result.success,
        hasContent: !!result.content,
        contentLength: result.content?.length || 0,
        error: result.error || '无错误'
      });

      if (!result.success) {
        console.error('处理文本失败:', result.error);
        return NextResponse.json(
          { error: result.error || '处理文本时出错', success: false },
          { status: 500 }
        );
      }

      // 确保返回内容不为空
      if (!result.content || result.content.trim() === '') {
        console.error('API返回的内容为空');
        return NextResponse.json(
          { error: 'AI服务返回了空内容', success: false },
          { status: 500 }
        );
      }

      console.log('API处理成功完成');

      // 返回处理结果
      return NextResponse.json({
        content: result.content,
        success: true
      });
    } catch (openaiError: any) {
      console.error('OpenAI API错误:', openaiError);
      return NextResponse.json({
        error: `OpenAI API错误: ${openaiError.message || '未知错误'}`,
        success: false
      }, { status: 500 });
    }
  } catch (error: any) {
    // 记录详细错误信息
    console.error('API处理错误:', error);
    let errorMessage = '服务器处理请求时出错';
    
    if (error instanceof Error) {
      console.error('错误类型:', error.name);
      console.error('错误详情:', error.message);
      console.error('错误堆栈:', error.stack);
      errorMessage = `服务器错误: ${error.message}`;
    }
    
    // 尝试生成回退响应
    let fallbackResponse = {
      content: '很抱歉，处理请求时遇到问题。请稍后再试或联系支持团队。',
      success: false,
      error: errorMessage
    };
    
    // 返回格式化的错误响应
    return NextResponse.json(
      fallbackResponse,
      { status: 500 }
    );
  }
} 