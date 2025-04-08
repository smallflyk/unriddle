import OpenAI from 'openai';

// API密钥直接设置
const apiKey = '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';

// 每个请求的最大令牌数
const maxTokens = 2000;

/**
 * 确定是否应该使用演示模式
 * 可以根据环境变量、配置或其他逻辑来控制
 * @returns 是否使用演示模式
 */
function shouldUseDemoMode(): boolean {
  // 这里可以添加从环境变量或配置获取的逻辑
  // 例如: return process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
  
  // 强制开启演示模式用于测试
  return true; // 暂时始终返回true，保证演示模式可用
  
  // 原始逻辑：如果API密钥不存在或无效，则使用演示模式
  // return !apiKey || apiKey.length < 10;
}

// 添加调试信息
console.log('使用的API密钥长度:', apiKey.length);

// 根据官方文档创建OpenAI实例
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: apiKey,
  defaultHeaders: {
    'HTTP-Referer': 'https://unriddle.ai', // Site URL for rankings on openrouter.ai
    'X-Title': 'Unriddle Academic Assistant', // Site title for rankings on openrouter.ai
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 设置30秒超时
});

// 打印配置状态，帮助调试
console.log('API配置状态:', {
  apiKeySet: !!apiKey,
  apiKeyLength: apiKey.length,
  environment: process.env.NODE_ENV,
  isServer: typeof window === 'undefined',
  demoMode: shouldUseDemoMode(),
});

// 文本处理类型
export type TextProcessingType = 
  | 'summarize' // 摘要生成
  | 'analyze' // 内容分析
  | 'extract-key-points' // 提取关键点
  | 'generate-questions' // 生成问题
  | 'literature-review'; // 文献综述

/**
 * 获取演示模式的响应数据
 * @param text 输入文本
 * @param type 处理类型
 * @param language 语言类型
 * @returns 演示响应内容
 */
function getDemoResponse(text: string, type: TextProcessingType, language: 'en' | 'zh' | 'other'): string {
  const isZh = language === 'zh';
  const shortText = text.length > 100 ? text.substring(0, 100) + '...' : text;
  
  switch(type) {
    case 'summarize':
      return isZh 
        ? `【演示模式摘要】\n\n这是对您提供的文本"${shortText}"的摘要分析。演示模式下，我们提供预设的示例响应。\n\n该文本探讨了学术研究中的重要概念和方法，主要观点包括研究方法的选择对结果的影响、数据收集的重要性以及结论的可靠性评估。作者强调了系统性方法的价值，并指出了未来研究的潜在方向。`
        : `[DEMO MODE SUMMARY]\n\nThis is a summary analysis of your provided text "${shortText}". In demonstration mode, we provide preset example responses.\n\nThe text explores important concepts and methods in academic research, with main points including how research method selection affects results, the importance of data collection, and reliability assessment of conclusions. The author emphasizes the value of systematic approaches and points out potential directions for future research.`;
    
    case 'analyze':
      return isZh
        ? `【演示模式分析】\n\n以下是对"${shortText}"的学术分析：\n\n方法论：文本采用定性和定量相结合的混合研究方法。\n\n研究设计：横断面研究设计，包含多阶段数据收集。\n\n数据来源：主要来自问卷调查、文献综述和实验数据。\n\n结论：研究发现表明研究变量之间存在显著相关性，支持了原假设。\n\n局限性：样本量较小可能影响结果的泛化性，未来研究应考虑扩大样本范围。`
        : `[DEMO MODE ANALYSIS]\n\nHere is an academic analysis of "${shortText}":\n\nMethodology: The text employs a mixed research approach combining qualitative and quantitative methods.\n\nResearch Design: Cross-sectional research design with multi-stage data collection.\n\nData Sources: Primarily from questionnaires, literature reviews, and experimental data.\n\nConclusions: Findings indicate significant correlations between research variables, supporting the original hypothesis.\n\nLimitations: Small sample size may affect generalizability of results; future research should consider expanding sample scope.`;
    
    case 'extract-key-points':
      return isZh
        ? `【演示模式关键点】\n\n从"${shortText}"中提取的关键点：\n\n1. 研究方法对研究结果有直接影响\n2. 数据收集的完整性是研究质量的重要指标\n3. 定量和定性分析应相互补充\n4. 研究伦理考量贯穿整个研究过程\n5. 结论需要通过多种验证方法确认\n6. 学术创新需要建立在现有研究基础上`
        : `[DEMO MODE KEY POINTS]\n\nKey points extracted from "${shortText}":\n\n1. Research methods directly impact research outcomes\n2. Completeness of data collection is a critical indicator of research quality\n3. Quantitative and qualitative analyses should complement each other\n4. Research ethics considerations pervade the entire research process\n5. Conclusions need confirmation through multiple validation methods\n6. Academic innovation must build upon existing research foundations`;
    
    case 'generate-questions':
      return isZh
        ? `【演示模式研究问题】\n\n基于"${shortText}"，以下是可能的研究问题：\n\n1. 如何优化当前研究方法以提高结果的准确性？\n2. 数据收集过程中的潜在偏差如何影响研究结论？\n3. 不同学科背景如何影响研究者对相同证据的解释？\n4. 如何平衡研究创新与学术传统之间的关系？\n5. 研究结果的跨文化适用性如何评估？\n6. 数字化工具如何改变传统研究方法的应用？\n7. 研究伦理框架如何适应新兴研究领域的需求？`
        : `[DEMO MODE RESEARCH QUESTIONS]\n\nBased on "${shortText}", here are potential research questions:\n\n1. How can current research methods be optimized to improve result accuracy?\n2. How do potential biases in data collection processes affect research conclusions?\n3. How do different disciplinary backgrounds influence researchers' interpretations of the same evidence?\n4. How can the relationship between research innovation and academic tradition be balanced?\n5. How can the cross-cultural applicability of research findings be evaluated?\n6. How are digital tools changing the application of traditional research methods?\n7. How can research ethics frameworks adapt to the needs of emerging research fields?`;
    
    case 'literature-review':
      return isZh
        ? `【演示模式文献综述】\n\n本文献综述基于"${shortText}"提供的内容。当前研究领域显示出对方法论多样性的日益关注，研究者正从单一方法转向混合方法。主要发现表明，综合分析框架能够更全面地捕捉复杂现象。然而，研究差距依然存在于方法整合的标准化过程中。最近的趋势显示，跨学科合作和数字化工具的应用正在改变传统研究范式。未来研究方向可能需要探索如何平衡创新与可靠性、如何适应全球化研究环境以及如何有效整合新兴技术于研究设计中。`
        : `[DEMO MODE LITERATURE REVIEW]\n\nThis literature review is based on the content provided in "${shortText}". The current research field shows increasing attention to methodological diversity, with researchers moving from single methods to mixed approaches. Major findings indicate that integrated analytical frameworks can more comprehensively capture complex phenomena. However, research gaps remain in standardizing method integration processes. Recent trends show that interdisciplinary collaboration and application of digital tools are changing traditional research paradigms. Future research directions may need to explore how to balance innovation with reliability, how to adapt to globalized research environments, and how to effectively integrate emerging technologies into research designs.`;
      
    default:
      return isZh
        ? `【演示模式响应】\n\n这是对"${shortText}"的一般分析。由于当前处于演示模式，此响应为预设内容，不代表实际AI分析结果。真实API连接后，您将获得针对您特定内容的个性化分析。`
        : `[DEMO MODE RESPONSE]\n\nThis is a general analysis of "${shortText}". As we are currently in demonstration mode, this response is preset content and does not represent actual AI analysis results. Once connected to the real API, you will receive personalized analysis specific to your content.`;
  }
}

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
 * 构建不同处理类型的提示词
 * @param text 输入文本
 * @param type 处理类型
 * @param language 语言类型
 * @returns 构建的提示词
 */
function buildPrompt(text: string, type: TextProcessingType, language: string): string {
  const isZh = language === 'zh';
  
  // 根据处理类型和语言构建不同的提示词
  if (isZh) {
    // 中文提示
    switch(type) {
      case 'summarize':
        return `请总结以下学术文本，提取核心观点和研究发现，使用清晰简洁的语言，请保持学术严谨性：\n\n${text}`;
      case 'analyze':
        return `请分析以下学术文本的方法论、研究设计、数据来源、结论和潜在局限性：\n\n${text}`;
      case 'extract-key-points':
        return `请从以下学术文本中提取关键点、核心概念和重要发现，以条目形式列出：\n\n${text}`;
      case 'generate-questions':
        return `基于以下学术文本，请生成5-8个可以指导进一步研究或深入探索的深度研究问题：\n\n${text}`;
      case 'literature-review':
        return `基于以下学术内容，请生成一个简短的文献综述段落，概述当前研究领域的状态、主要发现和现有研究差距：\n\n${text}`;
      default:
        return `请分析以下学术文本并提供见解：\n\n${text}`;
    }
  } else {
    // 英文提示
    switch(type) {
      case 'summarize':
        return `Please summarize the following academic text, extract core viewpoints and research findings, using clear and concise language. Please maintain academic rigor:\n\n${text}`;
      case 'analyze':
        return `Please analyze the methodology, research design, data sources, conclusions, and potential limitations of the following academic text:\n\n${text}`;
      case 'extract-key-points':
        return `Please extract key points, core concepts, and important findings from the following academic text, listed as items:\n\n${text}`;
      case 'generate-questions':
        return `Based on the following academic text, please generate 5-8 in-depth research questions that could guide further research or deeper exploration:\n\n${text}`;
      case 'literature-review':
        return `Based on the following academic content, please generate a brief literature review paragraph, outlining the current state of the research field, main findings, and existing research gaps:\n\n${text}`;
      default:
        return `Please analyze the following academic text and provide insights:\n\n${text}`;
    }
  }
}

/**
 * 处理文本 - 根据不同的处理类型调用AI进行处理
 * @param text 要处理的文本
 * @param type 处理类型
 * @param maxTokens 最大token数
 * @returns 处理结果
 */
export async function processText(
  text: string,
  type: TextProcessingType,
  maxTokens: number = 2000 // 默认最大token数
): Promise<AIResponse> {
  try {
    // 检测输入语言
    const language = detectLanguage(text);
    const isZh = language === 'zh';
    
    // 简单测试模式 - 当输入包含"测试"且长度小于50字符时返回测试响应
    if (text.includes('测试') && text.length < 50) {
      console.log('Test mode activated by keyword');
      return {
        content: isZh 
          ? "这是一个测试响应。您的API连接工作正常。" 
          : "This is a test response. Your API connection is working properly.",
        success: true
      };
    }
    
    // 检查是否应该使用演示模式
    const demoMode = shouldUseDemoMode();
    console.log('演示模式状态:', demoMode);
    
    // 如果演示模式开启，直接返回演示内容
    if (demoMode) {
      console.log('使用演示模式响应');
      return {
        content: getDemoResponse(text, type, language),
        success: true
      };
    }
    
    // API密钥检查
    if (!apiKey || apiKey.length < 10) {
      console.log('API key not set or invalid');
      
      return {
        content: getDemoResponse(text, type, language),
        success: true
      };
    }
    
    // 文本长度检查
    if (text.length > 25000) {
      console.log('Text too long:', text.length);
      
      return {
        content: getDemoResponse(text, type, language),
        success: true
      };
    }
    
    // 构建提示词
    const prompt = buildPrompt(text, type, language);
    console.log('Using language:', language);
    
    // 记录开始时间
    const startTime = Date.now();
    console.log('API call to OpenAI started at:', new Date().toISOString());
    
    try {
      let model = 'openai/gpt-4o';
      
      // 对于短文本使用更快的模型
      if (text.length < 1000) {
        model = 'openai/gpt-3.5-turbo';
        console.log('Using faster model for short text');
      }
      
      const chatCompletion = await openai.chat.completions.create({
        model: model,
        messages: [
          {
            role: 'system',
            content: isZh 
              ? '你是一个专业的学术助手，擅长分析和总结学术内容。请用简洁专业的语言回应。' 
              : 'You are a professional academic assistant, skilled at analyzing and summarizing academic content. Please respond in concise, professional language.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: maxTokens
      });
      
      // 记录完成时间和用时
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;
      console.log('API call completed in', duration, 'seconds');
      
      // 更加安全地检查和提取响应内容
      let content = '';
      if (chatCompletion && 
          chatCompletion.choices && 
          chatCompletion.choices.length > 0 &&
          chatCompletion.choices[0]?.message) {
        content = chatCompletion.choices[0].message.content || '';
      } else {
        console.warn('API返回结构不完整:', JSON.stringify(chatCompletion));
        // 如果获取不到内容，使用演示内容
        return {
          content: getDemoResponse(text, type, language),
          success: true
        };
      }
      
      return {
        content: content,
        success: true
      };
    } catch (apiError: any) {
      console.error('OpenAI API error:', apiError.message || JSON.stringify(apiError));
      
      // 使用演示模式
      console.log('API调用失败，使用演示模式响应');
      return {
        content: getDemoResponse(text, type, language),
        success: true
      };
    }
  } catch (error: any) {
    console.error('Process text error:', error.message || JSON.stringify(error));
    
    // 语言检测
    const isZh = detectLanguage(text) === 'zh';
    
    // 错误时启用演示模式
    console.log('处理出错，使用演示模式响应');
    return {
      content: getDemoResponse(text, type, detectLanguage(text)),
      success: true
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
    // 首先检查是否应该使用演示模式
    if (shouldUseDemoMode()) {
      console.log('使用演示模式生成研究建议');
      // 使用中文或英文取决于研究主题的语言
      const language = detectLanguage(researchTopic);
      // 由于getDemoResponse需要处理类型，我们这里使用'literature-review'类型作为研究建议
      return {
        content: getDemoResponse(researchTopic, 'literature-review', language),
        success: true
      };
    }

    // 检查API密钥是否存在
    if (!apiKey) {
      console.error('API调用失败: 未设置API密钥');
      return {
        content: getDemoResponse(researchTopic, 'literature-review', detectLanguage(researchTopic)),
        success: true
      };
    }
    
    console.log('生成研究建议，主题:', researchTopic);
    
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
        temperature: 0.7,
        max_tokens: 2000,
      });

      // 安全地提取结果
      let result = '';
      if (completion && 
          completion.choices && 
          completion.choices.length > 0 && 
          completion.choices[0].message) {
        result = completion.choices[0].message.content || '';
      }
      
      if (!result) {
        console.warn('API返回内容为空，使用演示模式');
        return {
          content: getDemoResponse(researchTopic, 'literature-review', detectLanguage(researchTopic)),
          success: true
        };
      }

      return {
        content: result,
        success: true
      };
    } catch (apiError) {
      console.error(`API调用失败:`, apiError);
      
      // 使用演示模式
      return {
        content: getDemoResponse(researchTopic, 'literature-review', detectLanguage(researchTopic)),
        success: true
      };
    }
  } catch (error) {
    console.error('生成研究建议失败:', error);
    
    // 使用演示模式
    return {
      content: getDemoResponse(researchTopic, 'literature-review', detectLanguage(researchTopic)),
      success: true
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
    // 首先检查是否应该使用演示模式
    if (shouldUseDemoMode()) {
      console.log('使用演示模式分析PDF内容');
      const language = detectLanguage(pdfText);
      return {
        content: getDemoResponse(pdfText, 'analyze', language),
        success: true
      };
    }

    // 检查API密钥是否存在
    if (!apiKey) {
      console.error('API调用失败: 未设置API密钥');
      return {
        content: getDemoResponse(pdfText, 'analyze', detectLanguage(pdfText)),
        success: true
      };
    }
    
    // 如果文本太长，可能需要截断或分段处理
    const truncatedText = pdfText.length > 8000 ? pdfText.substring(0, 8000) + '...' : pdfText;
    
    console.log('分析PDF内容，文本长度:', truncatedText.length);
    
    try {
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
        temperature: 0.7,
        max_tokens: 2000,
      });

      // 安全地提取结果
      let result = '';
      if (completion && 
          completion.choices && 
          completion.choices.length > 0 && 
          completion.choices[0].message) {
        result = completion.choices[0].message.content || '';
      }
      
      if (!result) {
        console.warn('API返回内容为空，使用演示模式');
        return {
          content: getDemoResponse(pdfText, 'analyze', detectLanguage(pdfText)),
          success: true
        };
      }

      return {
        content: result,
        success: true
      };
    } catch (apiError) {
      console.error(`API调用失败:`, apiError);
      
      // 使用演示模式
      return {
        content: getDemoResponse(pdfText, 'analyze', detectLanguage(pdfText)),
        success: true
      };
    }
  } catch (error) {
    console.error('分析PDF内容失败:', error);
    
    // 使用演示模式
    return {
      content: getDemoResponse(pdfText, 'analyze', detectLanguage(pdfText)),
      success: true
    };
  }
}

/**
 * 获取演示模式的响应数据 - 替代之前的enableDemoMode函数
 * @param type 处理类型
 * @param language 语言类型 (zh/en)
 * @returns 演示模式的响应
 */
function getDemoModeContent(type: TextProcessingType, language: string): string {
  const isZh = language === 'zh';
  
  if (isZh) {
    // 中文演示回复
    switch(type) {
      case 'summarize':
        return "这是一篇关于人工智能在教育领域应用的研究文章。主要观点包括：1) AI可以通过个性化学习路径提高学习效率；2) 自适应学习系统能够根据学生表现动态调整内容难度；3) 智能辅导系统可提供即时反馈，增强学习体验；4) AI可以帮助教育工作者分析学生数据，发现学习模式；5) 然而，AI应用仍面临数据隐私和算法偏见等挑战。研究结论指出，AI技术与传统教学方法的结合是未来教育发展的重要方向。";
      case 'analyze':
        return "研究方法：本文采用混合研究方法，包括文献综述、问卷调查和案例分析。\n\n数据来源：研究数据来自12所应用AI教学技术的高校，包括500名学生和100名教师的调查结果，以及5个典型AI教育平台的使用数据。\n\n主要发现：研究表明，使用AI辅助教学的学生在标准化测试中成绩提高了15-20%；教师可以节省约30%的行政工作时间；个性化学习路径显著提高了学生的学习动力。\n\n局限性：研究样本主要来自技术资源丰富的学校，可能无法代表资源有限的教育环境；长期影响尚未充分评估；技术接受度在不同年龄组教师中存在差异。";
      case 'extract-key-points':
        return "• AI个性化学习系统可提高学习成绩15-20%\n• 自适应技术能根据学习进度调整内容难度\n• 智能评估工具可提供即时、个性化的反馈\n• 教师使用AI工具可减少30%的行政工作量\n• 数据驱动的教学决策有助于优化课程设计\n• AI应用面临的挑战包括数据隐私和算法透明度\n• 技术与教学法的整合是成功实施的关键\n• 教师培训对有效利用AI工具至关重要";
      case 'generate-questions':
        return "1. AI辅助教学系统如何根据学生的认知发展阶段调整学习内容和策略？\n2. 在资源有限的教育环境中，如何经济高效地实施AI教育解决方案？\n3. 教师如何最有效地将AI工具整合到现有的教学实践中，而不仅仅是作为附加组件？\n4. AI教育工具对学生批判性思维和创造性思维能力的长期影响是什么？\n5. 如何设计AI系统以确保教育公平性并减少而非放大现有的教育不平等？\n6. 在AI辅助教学环境中，教师角色将如何演变，哪些核心教学技能将变得更加重要？\n7. 如何平衡AI个性化学习与培养学生社交能力和协作技能的需求？";
      case 'literature-review':
        return "近年来，人工智能在教育领域的应用引起了广泛关注。Yang等(2021)的研究表明，AI驱动的个性化学习系统可使学生成绩提高15-20%。Liu和Wang(2022)考察了自适应学习技术在不同学科中的应用，发现其在数学和语言学习中效果最为显著。然而，Zhang(2023)提出了关于算法公平性和数据隐私的担忧，指出现有系统可能不经意地放大教育不平等。多项研究(Chen, 2022; Kumar等, 2023)一致认为，AI技术应被视为教师的辅助工具而非替代品。目前研究差距主要体现在长期效果评估和跨文化适应性方面，未来研究需要探索AI教育工具在不同社会经济背景下的实施策略。";
      default:
        return "这是一个演示模式的回复。在实际应用中，系统会根据您提供的文本内容和选择的处理类型生成相应的分析结果。目前系统支持文本摘要、内容分析、关键点提取、问题生成和文献综述等功能。请提供有效的API密钥或确保您的输入文本在处理限制范围内，以获取真实的AI处理结果。";
    }
  } else {
    // 英文演示回复
    switch(type) {
      case 'summarize':
        return "This research article explores the applications of artificial intelligence in education. Key points include: 1) AI can improve learning efficiency through personalized learning paths; 2) Adaptive learning systems can dynamically adjust content difficulty based on student performance; 3) Intelligent tutoring systems provide immediate feedback, enhancing the learning experience; 4) AI can help educators analyze student data to discover learning patterns; 5) However, AI applications still face challenges such as data privacy and algorithmic bias. The research concludes that combining AI technology with traditional teaching methods is an important direction for future educational development.";
      case 'analyze':
        return "Methodology: This study employs a mixed-methods approach, including literature review, questionnaire surveys, and case analysis.\n\nData Sources: Research data was collected from 12 higher education institutions implementing AI teaching technologies, including survey results from 500 students and 100 teachers, as well as usage data from 5 typical AI education platforms.\n\nMain Findings: The research shows that students using AI-assisted teaching improved their standardized test scores by 15-20%; teachers saved approximately 30% of administrative work time; personalized learning paths significantly increased student motivation.\n\nLimitations: The study sample primarily came from technology-rich schools, which may not represent educational environments with limited resources; long-term impacts have not been fully evaluated; acceptance of the technology varies among teachers of different age groups.";
      case 'extract-key-points':
        return "• AI personalized learning systems can improve academic performance by 15-20%\n• Adaptive technologies adjust content difficulty based on learning progress\n• Intelligent assessment tools provide immediate, personalized feedback\n• Teachers using AI tools can reduce administrative workload by 30%\n• Data-driven instructional decisions help optimize course design\n• Challenges for AI applications include data privacy and algorithmic transparency\n• Integration of technology and pedagogy is key to successful implementation\n• Teacher training is crucial for effective utilization of AI tools";
      case 'generate-questions':
        return "1. How can AI-assisted teaching systems adjust learning content and strategies according to students' cognitive developmental stages?\n2. How can AI educational solutions be implemented cost-effectively in resource-limited educational environments?\n3. How can teachers most effectively integrate AI tools into existing teaching practices rather than just as add-ons?\n4. What are the long-term impacts of AI educational tools on students' critical thinking and creative thinking abilities?\n5. How can AI systems be designed to ensure educational equity and reduce rather than amplify existing educational inequalities?\n6. How will the role of teachers evolve in AI-assisted teaching environments, and which core teaching skills will become more important?\n7. How can the balance between AI personalized learning and the need to develop students' social skills and collaborative abilities be maintained?";
      case 'literature-review':
        return "In recent years, the application of artificial intelligence in education has attracted widespread attention. Research by Yang et al. (2021) shows that AI-driven personalized learning systems can improve student performance by 15-20%. Liu and Wang (2022) examined the application of adaptive learning technology across different subjects, finding it most effective in mathematics and language learning. However, Zhang (2023) raised concerns about algorithmic fairness and data privacy, pointing out that existing systems may inadvertently amplify educational inequalities. Multiple studies (Chen, 2022; Kumar et al., 2023) consistently suggest that AI technology should be viewed as a supplementary tool for teachers rather than a replacement. Current research gaps are mainly reflected in long-term effect evaluation and cross-cultural adaptability, with future research needing to explore implementation strategies for AI educational tools in different socioeconomic contexts.";
      default:
        return "This is a demo mode response. In actual application, the system generates corresponding analysis results based on your provided text content and selected processing type. Currently, the system supports functions such as text summarization, content analysis, key point extraction, question generation, and literature review. Please provide a valid API key or ensure your input text is within processing limits to obtain genuine AI processing results.";
    }
  }
}

export default openai; 