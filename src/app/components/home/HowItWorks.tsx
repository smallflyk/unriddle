import Image from 'next/image';

const StepCard = ({ 
  number, 
  title, 
  description 
} : { 
  number: number, 
  title: string, 
  description: string 
}) => {
  return (
    <div className="flex items-start">
      <div className="flex-shrink-0 mr-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-bold">
          {number}
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      </div>
    </div>
  );
};

const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      title: "输入研究问题",
      description: "通过自然语言输入您的研究问题或兴趣点，Unriddle将理解您的研究意图，为您提供精准的研究建议。"
    },
    {
      number: 2,
      title: "搜索与筛选",
      description: "Unriddle会在超过1亿篇学术论文中进行智能搜索，自动筛选最相关的研究文献，并根据相关性、发表时间和引用次数进行排序。"
    },
    {
      number: 3,
      title: "内容分析与摘要",
      description: "系统自动分析筛选出的文献内容，提取关键信息，生成简洁明了的研究摘要，帮助您快速了解研究现状。"
    },
    {
      number: 4,
      title: "深度解析与问答",
      description: "您可以针对感兴趣的研究文献提出具体问题，Unriddle将基于原文内容提供准确解答，并标注信息来源以确保可靠性。"
    },
    {
      number: 5,
      title: "研究报告生成",
      description: "根据您的需求，Unriddle可以自动生成文献综述、研究现状分析、研究趋势预测等多种形式的研究报告，为您的学术工作提供有力支持。"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">如何使用 <span className="gradient-text">Unriddle</span></h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Unriddle的工作流程简单高效，只需几个步骤，就能帮助您解锁海量学术信息，获取有价值的研究洞见。
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="space-y-10">
              {steps.map((step) => (
                <StepCard 
                  key={step.number}
                  number={step.number}
                  title={step.title}
                  description={step.description}
                />
              ))}
            </div>
          </div>
          
          <div className="order-1 lg:order-2 relative">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 max-w-lg mx-auto">
              <div className="relative aspect-[4/3] bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex flex-col justify-center items-center">
                  <div className="text-center px-6">
                    <div className="w-20 h-20 rounded-full bg-primary/20 mx-auto mb-6 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-primary/40 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-primary"></div>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-3">Unriddle 工作流程演示</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                      查看我们的交互式演示，了解Unriddle如何帮助您提升研究效率
                    </p>
                    <button className="bg-primary text-white py-2 px-6 rounded-lg flex items-center mx-auto">
                      <span className="mr-2">观看演示</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-primary/10 rounded-full blur-xl z-0"></div>
            <div className="absolute -left-4 -top-4 w-24 h-24 bg-accent/10 rounded-full blur-xl z-0"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks; 