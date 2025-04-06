import Image from 'next/image';
import Link from 'next/link';

const Hero = () => {
  return (
    <section className="pt-32 pb-20 bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="w-full lg:w-1/2 mb-12 lg:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="gradient-text">解读</span>复杂学术内容，
              <span className="gradient-text">揭示</span>研究洞见
            </h1>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl">
              Unriddle是一款智能学术研究助手，帮助研究人员快速搜索、分析和理解学术文献，提升研究效率与质量。我们的AI技术让学术研究变得更加简单、高效。
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup" className="btn btn-primary text-center sm:w-auto w-full">
                免费开始使用
              </Link>
              <Link href="/tools" className="btn btn-secondary text-center sm:w-auto w-full">
                体验AI工具
              </Link>
            </div>
            <div className="mt-8 flex items-center text-sm text-gray-600 dark:text-gray-400">
              <span className="mr-2">已被全球超过</span>
              <span className="font-semibold text-primary">10,000+</span>
              <span className="ml-2">研究人员和学者信任</span>
            </div>
          </div>
          <div className="w-full lg:w-1/2 relative">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 md:p-8 max-w-xl mx-auto">
              <div className="pb-3 border-b border-gray-100 dark:border-gray-700 mb-6">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <div className="ml-4 text-gray-800 dark:text-gray-200 text-sm">Unriddle研究助手</div>
                </div>
              </div>
              <div className="relative">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                  <div className="text-gray-700 dark:text-gray-300 text-sm">
                    <div className="font-medium mb-2">研究问题：</div>
                    <div>人工智能对学术研究效率的影响</div>
                  </div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4 border-l-4 border-primary">
                  <div className="text-gray-700 dark:text-gray-300 text-sm">
                    <div className="font-medium mb-2">Unriddle分析：</div>
                    <div>已为您找到127篇相关文献，其中35篇高度相关。根据近期研究，AI工具可提高研究效率30-45%，主要通过加速文献筛选、内容摘要和数据分析过程。</div>
                  </div>
                </div>
                <div className="flex justify-between gap-4">
                  <Link href="/tools/research" className="bg-primary-light text-white text-sm py-2 px-4 rounded-lg flex-grow text-center">获取详细分析</Link>
                  <Link href="/tools" className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm py-2 px-4 rounded-lg flex-grow text-center">生成文献综述</Link>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-accent/10 rounded-full blur-xl z-0"></div>
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/10 rounded-full blur-xl z-0"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 