import Link from 'next/link';

const CTA = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            准备好提升您的研究效率了吗？
          </h2>
          <p className="text-xl mb-10 text-white/90">
            加入已在使用Unriddle解锁学术潜能的全球10,000+研究者队伍。免费开始，无需信用卡。
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/signup" className="btn bg-white text-primary hover:bg-gray-100 font-medium">
              免费开始使用
            </Link>
            <Link href="/demo" className="btn border-2 border-white text-white hover:bg-white/10">
              预约演示
            </Link>
          </div>
          <div className="mt-8 text-sm text-white/80">
            <p>已有账号？<Link href="/login" className="text-white underline">立即登录</Link></p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA; 