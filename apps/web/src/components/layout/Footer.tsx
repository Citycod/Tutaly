import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="footer" aria-label="Site footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <div className="footer__brand-name">
              <Image src="/logo.png" alt="Tutaly" width={140} height={40} className="h-8 w-auto object-contain" />
            </div>
            <p className="footer__brand-desc">The professional ecosystem for the world's workforce. Find jobs, understand your market value, and build the career you deserve — wherever you are.</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <a href="#" className="btn btn--ghost btn--sm" aria-label="Follow Tutaly on Twitter" style={{ padding: '6px' }}>
                𝕏
              </a>
              <a href="#" className="btn btn--ghost btn--sm" aria-label="Follow Tutaly on LinkedIn" style={{ padding: '6px' }}>
                in
              </a>
              <a href="#" className="btn btn--ghost btn--sm" aria-label="Follow Tutaly on Instagram" style={{ padding: '6px' }}>
                ig
              </a>
            </div>
          </div>
          <nav aria-label="For professionals">
            <div className="footer__col-title">For professionals</div>
            <ul className="footer__links">
              <li><Link href="/jobs">Find jobs</Link></li>
              <li><Link href="/salaries">Salary check</Link></li>
              <li><Link href="/reviews">Company reviews</Link></li>
              <li><Link href="/connect">Network</Link></li>
              <li><Link href="/shop">Marketplace</Link></li>
            </ul>
          </nav>
          <nav aria-label="For employers">
            <div className="footer__col-title">For employers</div>
            <ul className="footer__links">
              <li><Link href="/employers">Post a job</Link></li>
              <li><Link href="/pricing">Pricing</Link></li>
              <li><Link href="/advertise">Advertise</Link></li>
              <li><Link href="/employer/dashboard">Dashboard</Link></li>
            </ul>
          </nav>
          <nav aria-label="Company links">
            <div className="footer__col-title">Company</div>
            <ul className="footer__links">
              <li><Link href="/about">About Tutaly</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/careers">We're hiring</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/press">Press</Link></li>
            </ul>
          </nav>
        </div>
        <div className="footer__bottom">
          <p className="footer__copy">© {new Date().getFullYear()} Tutaly. All rights reserved. Started in Lagos, building for everywhere.</p>
          <div className="footer__legal">
            <Link href="/legal/privacy-policy">Privacy</Link>
            <Link href="/legal/terms-of-service">Terms</Link>
            <Link href="/legal/cookies">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
