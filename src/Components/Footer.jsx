import React from "react";
import { FaAngleUp } from "react-icons/fa";



const Footer = () => {
  return (
    <footer id="footer footer-index" className="footer-wrapper">
      {/* <!-- FOOTER 1 --> */}

      {/* <!-- FOOTER 2 --> */}

      <div className="absolute-footer dark medium-text-center small-text-center">
        <div className="container clearfix">
          <div className="footer-primary pull-left">
            <div className="copyright-footer">
              Copyright 2025 © <strong>Savage Crown</strong> | Design by{" "}
              <strong>
                <a href="https://zoiop.com" target="blank">
                  zoiop
                </a>
              </strong>{" "}
            </div>
          </div>
        </div>
      </div>

      <a
        href="#top"
        className="back-to-top button pt-1 icon invert plain fixed bottom z-1 is-outline hide-for-medium circle active"
        id="top-link"
        aria-label="Go to top"
      >
        <FaAngleUp />
      </a>
    </footer>
  );
};

export default Footer;
