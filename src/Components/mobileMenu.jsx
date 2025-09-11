import { FaTwitter, FaDiscord, FaTimes } from "react-icons/fa";
import "./mobileMenu.css";

export default function MobileMenu({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="mobile-menu">
      <button className="close-btn" onClick={onClose}>
        <FaTimes />
      </button>

      <div className="menu-content">
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <FaTwitter />
        </a>
        <a href="https://discord.com" target="_blank" rel="noopener noreferrer">
          <FaDiscord />
        </a>
      </div>
    </div>
  );
}
