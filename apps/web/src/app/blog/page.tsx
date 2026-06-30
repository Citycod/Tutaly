import Link from "next/link";

export const metadata = {
  title: "Blog - Tutaly",
  description: "Insights, news, and career advice from the Tutaly team.",
};

export default function BlogPage() {
  return (
    <main>
      <section className="hero">
        <div className="container relative">
          <div className="hero__eyebrow">
            <div className="hero__eyebrow-line" aria-hidden="true"></div>
            <span>Tutaly Blog</span>
          </div>
          <h1 className="hero__title">Insights for your career.</h1>
          <p className="hero__subtitle">
            Data-backed research, company culture deep-dives, and updates from the Tutaly team.
          </p>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Article 1 */}
            <article className="bg-c800 border border-c700 rounded-xl overflow-hidden hover:border-c600 transition-colors flex flex-col h-full">
              <div className="h-48 bg-c700 relative overflow-hidden group">
                <div className="absolute inset-0 bg-blue/10 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-500">
                  📈
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="text-blue text-sm font-bold mb-3">Research</div>
                <h3 className="text-xl font-bold text-c100 mb-3 line-clamp-2">The 2024 Tech Salary Report: What's Changed?</h3>
                <p className="text-c400 text-sm mb-6 line-clamp-3 flex-1">We analyzed over 47,000 salaries to understand how compensation in tech is shifting globally. Here is what we found.</p>
                <Link href="#" className="text-blue font-medium text-sm hover:text-blueL inline-flex items-center gap-1">Read article &rarr;</Link>
              </div>
            </article>

            {/* Article 2 */}
            <article className="bg-c800 border border-c700 rounded-xl overflow-hidden hover:border-c600 transition-colors flex flex-col h-full">
              <div className="h-48 bg-c700 relative overflow-hidden group">
                <div className="absolute inset-0 bg-green/10 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-500">
                  🤝
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="text-green text-sm font-bold mb-3">Career Advice</div>
                <h3 className="text-xl font-bold text-c100 mb-3 line-clamp-2">How to Negotiate Your Salary (With Scripts)</h3>
                <p className="text-c400 text-sm mb-6 line-clamp-3 flex-1">Stop leaving money on the table. Here are proven scripts and strategies to help you get the compensation you deserve.</p>
                <Link href="#" className="text-blue font-medium text-sm hover:text-blueL inline-flex items-center gap-1">Read article &rarr;</Link>
              </div>
            </article>

            {/* Article 3 */}
            <article className="bg-c800 border border-c700 rounded-xl overflow-hidden hover:border-c600 transition-colors flex flex-col h-full">
              <div className="h-48 bg-c700 relative overflow-hidden group">
                <div className="absolute inset-0 bg-goldH/10 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-500">
                  🚀
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="text-goldH text-sm font-bold mb-3">Company News</div>
                <h3 className="text-xl font-bold text-c100 mb-3 line-clamp-2">Introducing the Tutaly Mentorship Marketplace</h3>
                <p className="text-c400 text-sm mb-6 line-clamp-3 flex-1">Today we are launching a new way to connect with industry leaders for 1-on-1 coaching, resume reviews, and interview prep.</p>
                <Link href="#" className="text-blue font-medium text-sm hover:text-blueL inline-flex items-center gap-1">Read article &rarr;</Link>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
