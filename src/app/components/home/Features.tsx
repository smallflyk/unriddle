import { 
  FaSearch, 
  FaFileAlt, 
  FaFilePdf, 
  FaQuoteRight, 
  FaPencilAlt,
  FaProjectDiagram
} from 'react-icons/fa';

const FeatureCard = ({ 
  icon, 
  title, 
  description 
} : { 
  icon: React.ReactNode, 
  title: string, 
  description: string 
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
      <div className="rounded-full bg-primary-light/10 w-14 h-14 flex items-center justify-center mb-5 text-primary">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
};

const Features = () => {
  const features = [
    {
      icon: <FaSearch size={24} />,
      title: "智能文献搜索",
      description: "基于自然语言的研究问题搜索，从超过1亿篇学术论文中精准定位您需要的研究资料。"
    },
    {
      icon: <FaFileAlt size={24} />,
      title: "研究内容摘要",
      description: "自动提取和总结论文关键内容，节省80%的阅读时间，快速获取核心研究发现。"
    },
    {
      icon: <FaFilePdf size={24} />,
      title: "PDF上传与分析",
      description: "上传您的PDF文件，Unriddle将自动分析内容，提取关键信息并支持智能问答交互。"
    },
    {
      icon: <FaQuoteRight size={24} />,
      title: "引用追踪验证",
      description: "确保每一条信息都有可靠来源，自动生成标准引用格式，提高研究可信度。"
    },
    {
      icon: <FaPencilAlt size={24} />,
      title: "智能写作辅助",
      description: "提供专业的学术写作建议，优化论文结构，改进表达方式，确保学术规范。"
    },
    {
      icon: <FaProjectDiagram size={24} />,
      title: "系统性文献综述",
      description: "自动化筛选标准生成，帮助整合研究结果，生成高质量的系统性文献综述报告。"
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Unriddle <span className="gradient-text">强大功能</span></h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            我们的平台集成了多种智能工具，为学术研究的各个环节提供全方位支持，让研究工作变得更加高效和智能。
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index} 
              icon={feature.icon} 
              title={feature.title} 
              description={feature.description} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features; 