"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type FocusEvent } from "react";

const serviceLinks = [
  { href: "/", label: "Erhvervsrengøring" },
  { href: "/services/restauranter", label: "Restauranter" },
  { href: "/services/kontor", label: "Kontor" },
  { href: "/services/institutioner", label: "Institutioner" },
  { href: "/services/solarium", label: "Solcenter" },
  { href: "/services/sommerhus", label: "Sommerhuse" },
] as const;

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesMenuRef = useRef<HTMLDivElement>(null);
  const servicesButtonRef = useRef<HTMLButtonElement>(null);
  const suppressFocusOpenRef = useRef(false);

  function closeNavigation() {
    setMenuOpen(false);
    setServicesOpen(false);
  }

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 768) closeNavigation();
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      const wasServicesOpen = servicesOpen;
      closeNavigation();
      if (wasServicesOpen) {
        suppressFocusOpenRef.current = true;
        servicesButtonRef.current?.focus();
        window.setTimeout(() => {
          suppressFocusOpenRef.current = false;
        }, 0);
      }
    }

    function handlePointerDown(event: PointerEvent) {
      if (!servicesMenuRef.current?.contains(event.target as Node)) {
        setServicesOpen(false);
      }
    }

    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleEscape);
    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleEscape);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [servicesOpen]);

  function handleServicesBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setServicesOpen(false);
    }
  }

  return (
    <header>
      <Link className="logo-link" href="/" aria-label="Gå til forsiden">
        <Image
          src="/images/header_logo.png"
          alt="Kolding Rengøring tekst logo"
          width={500}
          height={150}
          priority
        />
      </Link>
      <button
        className="nav-toggle"
        type="button"
        aria-label={menuOpen ? "Luk menu" : "Åbn menu"}
        aria-expanded={menuOpen}
        aria-controls="primary-nav"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span className={`menu-icon${menuOpen ? " is-open" : ""}`} aria-hidden="true">
          <span />
        </span>
      </button>
      <nav
        id="primary-nav"
        className={`primary-nav${menuOpen ? " is-open" : ""}`}
        aria-label="Primær navigation"
      >
        <div
          className="services-menu"
          ref={servicesMenuRef}
          onMouseEnter={() => setServicesOpen(true)}
          onMouseLeave={() => setServicesOpen(false)}
          onBlur={handleServicesBlur}
        >
          <button
            id="nav-services"
            ref={servicesButtonRef}
            className="nav-link"
            type="button"
            aria-label="Se vores services"
            aria-expanded={servicesOpen}
            aria-controls="services-sub-nav"
            onClick={() => setServicesOpen((open) => !open)}
            onFocus={(event) => {
              if (!suppressFocusOpenRef.current && event.currentTarget.matches(":focus-visible")) {
                setServicesOpen(true);
              }
            }}
          >
            Vi tilbyder
            <span className="submenu-chevron" aria-hidden="true" />
          </button>
          <ul
            id="services-sub-nav"
            className={`sub-nav${servicesOpen ? " is-visible" : ""}`}
          >
            {serviceLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} onClick={closeNavigation}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <Link href="/#pricing" className="nav-link" onClick={closeNavigation}>
          Priser
        </Link>
        <Link href="/#contact" className="nav-link" onClick={closeNavigation}>
          Kontakt
        </Link>
      </nav>
    </header>
  );
}
