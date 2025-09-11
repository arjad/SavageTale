import React, { useEffect, useRef, useState } from "react";
import $ from "jquery";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Main = () => {
  const [page, setPage] = useState(null);
  const contentRef = useRef(null); // 🔹 scope jQuery to the injected content
  // // Toggle body class while loading
  // useEffect(() => {
  //   document.body.classList.toggle("loading", loading);
  // }, [loading]);

  // Fetch WordPress content
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("https://savagetale.xyz/wp-json/wp/v2/pages/2");
        const data = await res.json();
        setPage(data);
      } catch (err) {
        console.error("Error fetching page:", err);
      }
    })();
  }, []);

  // Manipulate injected HTML after load
  useEffect(() => {
    if (!page || !contentRef.current) return;

    requestAnimationFrame(() => {
      const $root = $(contentRef.current);

      // ✅ remove the unwanted loader injected by WP theme
      $root.find(".loading-spin").remove();

      // ✅ find the hero div regardless of nesting
      const $hero = $root.find(".bg.section-bg.fill.bg-fill.bg-loaded").first();
      if ($hero.length) {
        $hero.addClass("parallax-active");
      } else {
        console.warn("Hero .bg.section-bg.fill.bg-fill.bg-loaded not found");
      }

      // remove or disable banner overlay that dims the image
      $root.find(".banner-link.fill").remove();

      // ✅ duplicate carousel rows
      $root.find(".carousel-row").each(function () {
        const m = $(this).html();
        $(this).empty().append(m).append(m).append(m);
      });
    });
  }, [page]);

  return (
    <div>
      <Navbar />
      {/* Inject WP content */}
      <div
        ref={contentRef}
        dangerouslySetInnerHTML={{ __html: page?.content?.rendered || "" }}
      />
      <Footer />
    </div>
  );
};

export default Main;
