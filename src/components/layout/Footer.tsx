import Image from "next/image";
import Link from "next/link";

import { CookieSettingsButton } from "@/components/integrations/CookieSettingsButton";
import { siteConfig } from "@/config/site";
import { locations } from "@/content/locations";

function FacebookIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8h3V4h-3c-3 0-5 2-5 5v2H6v4h3v7h4v-7h3l1-4h-4V9c0-.6.4-1 1-1Z" /></svg>;
}

function LinkedInIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 8.5H3V21h3.5V8.5ZM4.8 3A2.1 2.1 0 1 0 4.8 7a2.1 2.1 0 0 0 0-4ZM21 14c0-3.8-2-5.8-4.8-5.8-2.2 0-3.2 1.2-3.8 2.1V8.5H9V21h3.5v-6.2c0-1.6.3-3.2 2.3-3.2 2 0 2 1.9 2 3.3V21H21v-7Z" /></svg>;
}

function InstagramIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 3a2 2 0 0 0-2 2v10c0 1.1.9 2 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H7Zm10.4 1.5a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2ZM12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0 2.2a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6Z" /></svg>;
}

export function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-info">
          <h3>{siteConfig.companyName}</h3>
          <p>CVR: {siteConfig.cvr}</p>
        </div>
        <div className="footer-contact">
          <h4>Kontakt os</h4>
          <p>
            Email: <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>
          </p>
          <p>
            Telefon: <a href={siteConfig.contact.phoneHref}>{siteConfig.contact.phoneDisplay}</a>
          </p>
        </div>
        <div className="footer-links">
          <h4>Links</h4>
          <ul>
            <li><Link href="/services/restauranter">Restauranter</Link></li>
            <li><Link href="/services/kontor">Kontor</Link></li>
            <li><Link href="/services/solarium">Solcenter</Link></li>
          </ul>
        </div>
        <div className="footer-links">
          <h4>Lokationer</h4>
          <ul>
            <li><Link href="/">Kolding</Link></li>
            {locations.map((location) => (
              <li key={location.slug}>
                <Link href={`/${location.slug}`}>{location.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer-social">
          <h4>Følg os</h4>
          <div className="social-icons">
            <a className="social-icon" href={siteConfig.social.facebook} target="_blank" rel="noreferrer" aria-label="Facebook"><FacebookIcon /></a>
            <a className="social-icon" href={siteConfig.social.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedInIcon /></a>
            <a className="social-icon" href={siteConfig.social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><InstagramIcon /></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div aria-label="Accepterede betalingsmetoder">
          <Image src="/images/mobilepay.svg" alt="Betal med MobilePay" width={48} height={30} />
          <Image src="/images/mastercard-svgrepo-com.svg" alt="Betal med Mastercard" width={48} height={30} />
          <Image src="/images/visa-3-svgrepo-com.svg" alt="Betal med Visa" width={48} height={30} />
        </div>
        <div className="footer-legal-container">
          <p>© 2026 Kolding Rengøring. All Rights Reserved.</p>
          <div className="footer-legal"><Link href="/privatlivspolitik">Privatlivspolitik</Link></div>
          <div className="footer-legal"><Link href="/job">Job</Link></div>
          <CookieSettingsButton />
        </div>
      </div>
    </footer>
  );
}
