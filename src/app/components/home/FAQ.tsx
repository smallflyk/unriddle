"use client";

import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const FAQItem = ({ 
  question, 
  answer,
  isOpen,
  toggleOpen
} : { 
  question: string, 
  answer: string,
  isOpen: boolean,
  toggleOpen: () => void
}) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 py-5">
      <button 
        className="flex justify-between items-center w-full text-left focus:outline-none"
        onClick={toggleOpen}
      >
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{question}</h3>
        <span className="ml-6 flex-shrink-0 text-gray-500 dark:text-gray-400">
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </span>
      </button>
      {isOpen && (
        <div className="mt-4">
          <p className="text-gray-600 dark:text-gray-400">{answer}</p>
        </div>
      )}
    </div>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "Unriddle如何帮助我提高研究效率？",
      answer: "Unriddle通过多种方式提高研究效率：智能搜索可快速找到最相关文献；自动内容摘要帮您节省80%阅读时间；PDF分析工具能解析上传的研究文档；引用追踪确保信息可靠；写作辅助改进学术表达；系统性文献综述工具自动化整理研究发现。这些功能共同作用，大幅减少研究过程中的手动工作。"
    },
    {
      question: "Unriddle的文献数据来源于哪里？",
      answer: "Unriddle连接了多个主要学术数据库，包括但不限于Google Scholar、PubMed、Web of Science、IEEE Xplore、arXiv等。我们的系统能够搜索超过1亿篇学术论文，覆盖几乎所有研究领域。我们定期更新数据库，确保您能访问最新的研究成果。"
    },
    {
      question: "Unriddle如何确保信息的准确性和可靠性？",
      answer: "Unriddle采用多重验证机制确保信息准确性：每条信息都附带原始来源引用；系统会交叉检查多个来源；我们的算法经过训练，能识别高质量、同行评审的研究；对于生成的摘要和分析，我们提供原文对照功能，让您可以验证内容；此外，我们的研究质量评估系统会对方法学、样本量等关键因素进行评分。"
    },
    {
      question: "我可以上传自己的PDF文件进行分析吗？",
      answer: "是的，Unriddle支持PDF上传和分析功能。您可以上传自己收集的研究论文、报告或其他学术文档，我们的系统将自动分析内容，提取关键信息，并允许您针对文档内容提问。免费版用户每天可上传2个PDF文件，专业版和团队版用户则没有上传限制。"
    },
    {
      question: "Unriddle支持哪些学科领域的研究？",
      answer: "Unriddle支持几乎所有学术研究领域，包括自然科学（物理、化学、生物等）、社会科学（心理学、经济学、社会学等）、医学与健康科学、工程与技术、人文艺术等。我们的系统经过训练，能理解不同学科的专业术语和研究方法，为各领域研究者提供精准支持。"
    },
    {
      question: "如何开始使用Unriddle？",
      answer: "开始使用Unriddle非常简单。首先，注册一个免费账户；然后，在搜索框中输入您的研究问题或兴趣点；系统会立即开始搜索相关文献并生成摘要；您可以进一步探索搜索结果，上传自己的PDF，或使用我们的写作辅助工具。我们提供详细的使用教程和指南，帮助您快速上手。"
    },
    {
      question: "Unriddle如何保护我的研究数据和隐私？",
      answer: "保护用户隐私和研究数据是我们的首要任务。Unriddle采用行业标准的加密技术保护您的账户和数据；您上传的PDF文件和研究内容仅您自己可见；我们不会与第三方共享您的个人研究数据；所有数据存储符合GDPR等全球隐私法规要求；此外，我们提供数据导出和删除选项，确保您对自己的数据拥有完全控制权。"
    },
    {
      question: "我可以与团队成员共享研究结果吗？",
      answer: "是的，Unriddle团队版提供强大的协作功能。您可以邀请团队成员加入您的研究项目；共享搜索结果、分析报告和PDF文件；进行协作笔记和评论；共同编辑研究报告；设置不同的权限级别，控制谁可以查看或编辑内容。这些功能使研究团队能够高效协作，共同推进研究项目。"
    }
  ];

  return (
    <section id="faq" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">常见<span className="gradient-text">问题</span></h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            我们收集了用户最常问的问题，希望能帮助您更好地了解Unriddle如何满足您的研究需求。
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
          {faqs.map((faq, index) => (
            <FAQItem 
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              toggleOpen={() => toggleFAQ(index)}
            />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            没有找到您要问的问题？
          </p>
          <a 
            href="/contact" 
            className="btn btn-primary"
          >
            联系我们
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ; 