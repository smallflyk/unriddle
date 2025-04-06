import { FaCheck } from 'react-icons/fa';
import Link from 'next/link';

const PricingCard = ({ 
  title, 
  price, 
  description, 
  features, 
  isPopular = false,
  ctaText
} : { 
  title: string, 
  price: string, 
  description: string, 
  features: string[],
  isPopular?: boolean,
  ctaText: string
}) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 relative ${isPopular ? 'border-2 border-primary' : ''}`}>
      {isPopular && (
        <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1 text-sm font-medium rounded-bl-lg rounded-tr-lg">
          最受欢迎
        </div>
      )}
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <div className="mb-4">
        <span className="text-3xl font-bold">{price}</span>
        {price !== "免费" && <span className="text-gray-600 dark:text-gray-400 ml-1">/月</span>}
      </div>
      <p className="text-gray-600 dark:text-gray-400 mb-6">{description}</p>
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <FaCheck className="text-primary mt-1 mr-2 flex-shrink-0" />
            <span className="text-gray-700 dark:text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>
      <Link 
        href="/signup" 
        className={`block text-center py-3 px-4 rounded-lg w-full ${
          isPopular 
            ? 'bg-primary text-white hover:bg-primary-dark' 
            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
        }`}
      >
        {ctaText}
      </Link>
    </div>
  );
};

const Pricing = () => {
  const pricingPlans = [
    {
      title: "免费版",
      price: "免费",
      description: "适合初次体验的用户",
      features: [
        "基础文献搜索功能",
        "每日限制5篇论文分析",
        "基本摘要功能",
        "PDF上传限制(2个/天)",
        "社区支持"
      ],
      ctaText: "免费注册"
    },
    {
      title: "专业版",
      price: "¥99",
      description: "为研究者提供全方位支持",
      features: [
        "高级文献搜索功能",
        "无限论文分析",
        "详细内容摘要与分析",
        "无限PDF上传与分析",
        "智能写作辅助",
        "优先技术支持"
      ],
      isPopular: true,
      ctaText: "开始免费试用"
    },
    {
      title: "团队版",
      price: "¥299",
      description: "适合研究团队与教育机构",
      features: [
        "所有专业版功能",
        "5个用户账号",
        "团队协作功能",
        "高级数据分析",
        "API访问权限",
        "自定义集成",
        "专属客户经理"
      ],
      ctaText: "联系我们"
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">简单透明的<span className="gradient-text">定价方案</span></h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            选择最适合您需求的Unriddle方案，无论您是个人研究者还是大型研究团队，我们都提供灵活且实惠的选择。
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <PricingCard 
              key={index}
              title={plan.title}
              price={plan.price}
              description={plan.description}
              features={plan.features}
              isPopular={plan.isPopular}
              ctaText={plan.ctaText}
            />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            需要更多定制化的企业解决方案？ <a href="/contact" className="text-primary font-medium">联系我们的销售团队</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing; 