import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Unriddle | 智能学术研究助手 | 轻松揭示研究洞见",
  description: "Unriddle是一款强大的学术研究助手，帮助研究人员快速搜索、分析和理解学术文献，大幅提升研究效率。我们的AI技术能够从超过1亿篇论文中提取关键洞见，生成高质量摘要，并支持系统性文献综述。",
  keywords: "Unriddle, 学术研究, 智能助手, AI研究工具, 文献分析, 学术搜索, 研究效率, 文献综述工具, PDF分析, 学术写作辅助",
  metadataBase: new URL("https://unriddle.ai"),
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://unriddle.ai",
    siteName: "Unriddle 智能学术研究助手",
    title: "Unriddle | 揭示研究奥秘，提升学术效率",
    description: "利用AI技术解锁学术潜能，从超过1亿篇论文中快速找到关键洞见，节省80%研究时间。",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Unriddle 智能学术研究助手",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Unriddle | 智能学术研究助手",
    description: "利用AI技术解锁学术潜能，从超过1亿篇论文中快速找到关键洞见。",
    images: ["/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={inter.variable}>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-LGS72Z0MZW"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-LGS72Z0MZW');
          `}
        </Script>
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
