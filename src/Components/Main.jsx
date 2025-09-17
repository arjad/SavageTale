import React, { useEffect, useRef, useState } from "react";
import $ from "jquery";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Main = () => {
  const [page, setPage] = useState(null);
  const contentRef = useRef(null); // 🔹 scope jQuery to the injected content


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

  useEffect(() => {
    if (!page || !contentRef.current) return;
  
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const containers = contentRef.current.querySelectorAll(
        ".row.row-collapse.align-bottom.align-center.is-full-height.banner-layer"
      );
  
      containers.forEach(container => {
        if (!container) return;
  
        const $els = container.querySelectorAll("[data-parallax]");
        $els.forEach(el => {
          const speed = parseFloat(el.getAttribute("data-parallax")) || 0;
          el.style.transform = `translateY(${-scrollY * speed * 0.1}px)`;
        });
  
        const $fades = container.querySelectorAll("[data-parallax-fade]");
        $fades.forEach(el => {
          el.style.opacity = 1 - scrollY / 400;
        });
      });
  
      const crownContainers = contentRef.current.querySelectorAll("[data-parallax]");
      crownContainers.forEach(container => {
        if (container.querySelector(".intro-crown")) {
          const speed = parseFloat(container.getAttribute("data-parallax")) || 0;
          container.style.transform = `translateY(${-scrollY * speed * 0.1}px)`;
  
          if (container.hasAttribute("data-parallax-fade")) {
            container.style.opacity = 1 - scrollY / 400;
          }
        } else if (container.querySelector(".intro-flag")) {
          const speed = parseFloat(container.getAttribute("data-parallax")) || 0;
          container.style.transform = `translateY(${-scrollY * speed * 0.1}px)`;
  
          if (container.hasAttribute("data-parallax-fade")) {
            container.style.opacity = 1 - scrollY / 400;
          }
        }
      });
  
      const crownChildren = contentRef.current.querySelectorAll(
        ".intro-flag[data-parallax], .intro-crown[data-parallax]"
      );
      
      crownChildren.forEach(el => {
        const speed = parseFloat(el.getAttribute("data-parallax")) || 0;
        el.style.transform = `translateY(${-scrollY * speed * 0.1}px)`;
  
        if (el.hasAttribute("data-parallax-fade")) {
          el.style.opacity = 1 - scrollY / 400;
        }
      });
    };
  
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
  
    return () => window.removeEventListener("scroll", handleScroll);
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
