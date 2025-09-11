import { useEffect, useState } from "react";
import { FaTwitter, FaDiscord, FaBars } from "react-icons/fa";
import "./Navbar.css";
import logo from "../assets/NEW_LogoFlag_001.png";
import MobileMenu from "./mobileMenu";

export default function Navbar() {
  const [show, setShow] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const onScroll = () => {
      setShow(window.scrollY > 20);
    };
    const onResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <>
      {/* Floating icons / hamburger at the very top (before scroll) */}
      {!show && (
        <div className="floating-icons">
          {!isMobile ? (
            // Desktop floating icons
            <div className="desktop-icons">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FaTwitter />
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer">
                <FaDiscord />
              </a>
            </div>
          ) : (
            // Mobile hamburger
            !menuOpen && (
              <div className="mobile-hamburger" onClick={() => setMenuOpen(true)}>
                <FaBars />
              </div>
            )
          )}
        </div>
      )}

      {/* Navbar on scroll (desktop = logo+icons, mobile = logo+hamburger) */}
      {show && (
        <nav className="navbar show">
          <div className="navbar-container">
            <div className="logo">
              <img src={logo} alt="Savage Tale Logo" />
            </div>

            <div className="links">
              {!isMobile ? (
                <>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                    <FaTwitter />
                  </a>
                  <a href="https://discord.com" target="_blank" rel="noopener noreferrer">
                    <FaDiscord />
                  </a>
                </>
              ) : (
                !menuOpen && (
                  <div className="mobile-hamburger" onClick={() => setMenuOpen(true)}>
                    <FaBars />
                  </div>
                )
              )}
            </div>
          </div>
        </nav>
      )}

      {/* Mobile fullscreen menu */}
      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
