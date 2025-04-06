import Link from 'next/link';
import { FaTwitter, FaLinkedinIn, FaGithub, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 pt-16 pb-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="col-span-1">
            <Link href="/" className="flex items-center mb-5">
              <span className="text-2xl font-bold gradient-text">Unriddle</span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Unriddle是您的智能学术研究助手，为学者提供强大的文献搜索、内容分析和写作辅助工具。
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                <FaLinkedinIn size={20} />
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                <FaGithub size={20} />
              </a>
              <a href="mailto:contact@unriddle.ai" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                <FaEnvelope size={20} />
              </a>
            </div>
          </div>
          
          <div className="col-span-1">
            <h4 className="text-lg font-semibold mb-5">产品</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#features" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                  智能文献搜索
                </Link>
              </li>
              <li>
                <Link href="#features" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                  研究内容摘要
                </Link>
              </li>
              <li>
                <Link href="#features" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                  PDF分析工具
                </Link>
              </li>
              <li>
                <Link href="#features" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                  写作辅助
                </Link>
              </li>
              <li>
                <Link href="#features" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                  系统性文献综述
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h4 className="text-lg font-semibold mb-5">资源</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/blog" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                  研究方法博客
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                  教程指南
                </Link>
              </li>
              <li>
                <Link href="/case-studies" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                  案例研究
                </Link>
              </li>
              <li>
                <Link href="/api" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                  API文档
                </Link>
              </li>
              <li>
                <Link href="/webinars" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                  网络研讨会
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h4 className="text-lg font-semibold mb-5">公司</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                  关于我们
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                  工作机会
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                  隐私政策
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                  服务条款
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                  联系我们
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Unriddle AI. 保留所有权利。
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-600 dark:text-gray-400 text-sm hover:text-primary">
                隐私政策
              </Link>
              <Link href="/terms" className="text-gray-600 dark:text-gray-400 text-sm hover:text-primary">
                服务条款
              </Link>
              <Link href="/cookies" className="text-gray-600 dark:text-gray-400 text-sm hover:text-primary">
                Cookie政策
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 