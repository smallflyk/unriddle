"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaFileAlt, FaFilePdf, FaFlask, FaHome } from "react-icons/fa";

export default function ToolsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const navigation = [
    { name: "首页", href: "/", icon: <FaHome /> },
    { name: "文本分析", href: "/tools", icon: <FaFileAlt /> },
    { name: "研究建议", href: "/tools/research", icon: <FaFlask /> },
    { name: "PDF分析", href: "/tools/pdf", icon: <FaFilePdf /> },
  ];

  return (
    <div>
      <div className="fixed left-0 top-20 w-full bg-white dark:bg-gray-900 shadow-sm z-40 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto py-2 space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center whitespace-nowrap px-3 py-2 text-sm font-medium rounded-md ${
                  pathname === item.href
                    ? "text-primary bg-primary/10"
                    : "text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
      {children}
    </div>
  );
} 