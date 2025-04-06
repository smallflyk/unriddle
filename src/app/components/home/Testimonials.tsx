import Image from 'next/image';
import { FaQuoteLeft } from 'react-icons/fa';

const TestimonialCard = ({ 
  quote, 
  name, 
  title, 
  imageUrl 
} : { 
  quote: string, 
  name: string, 
  title: string, 
  imageUrl: string 
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 relative">
      <div className="text-primary/20 absolute top-6 left-6">
        <FaQuoteLeft size={40} />
      </div>
      <div className="relative z-10">
        <p className="text-gray-700 dark:text-gray-300 mb-6 italic">"{quote}"</p>
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mr-4 flex-shrink-0">
            {/* 此处可以替换为真实的用户头像 */}
            <div className="w-full h-full flex items-center justify-center text-primary font-bold">
              {name.charAt(0)}
            </div>
          </div>
          <div>
            <h4 className="font-semibold">{name}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      quote: "Unriddle彻底改变了我的文献综述流程。过去需要几周的工作现在只需几天就能完成，而且质量更高。找到相关研究和提取关键信息的速度令人难以置信。",
      name: "张教授",
      title: "北京大学 | 计算机科学教授",
      imageUrl: ""
    },
    {
      quote: "作为一名博士生，我曾经为了跟踪最新研究而苦恼。Unriddle不仅帮我找到了最相关的论文，还能快速提取关键发现，节省了我大量的阅读时间。",
      name: "李明",
      title: "复旦大学 | 博士研究生",
      imageUrl: ""
    },
    {
      quote: "我们研究团队使用Unriddle已有6个月，研究效率提高了40%以上。特别是系统性文献综述功能，让我们能够快速掌握研究领域的全景。",
      name: "王研究员",
      title: "中国科学院 | 高级研究员",
      imageUrl: ""
    },
    {
      quote: "作为一名临床医生，我需要快速了解最新的医学研究。Unriddle帮助我在繁忙的工作之余高效获取最新研究证据，提升了我的循证医学实践水平。",
      name: "陈医生",
      title: "上海交通大学附属医院 | 主治医师",
      imageUrl: ""
    },
    {
      quote: "Unriddle的写作辅助功能极大提升了我的论文质量。它不仅提供了结构建议，还帮助我改进了表达方式，让我的研究更容易被同行理解和引用。",
      name: "赵研究员",
      title: "浙江大学 | 助理教授",
      imageUrl: ""
    },
    {
      quote: "我们图书馆为师生订阅了Unriddle的团队版，反馈非常积极。它极大提高了我们学校的研究产出，尤其是对初级研究者的帮助更为明显。",
      name: "刘馆长",
      title: "武汉大学图书馆 | 馆长",
      imageUrl: ""
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">用户的<span className="gradient-text">真实体验</span></h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            来自各领域研究人员的真实反馈，看看Unriddle如何改变他们的研究方式。
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={index}
              quote={testimonial.quote}
              name={testimonial.name}
              title={testimonial.title}
              imageUrl={testimonial.imageUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 