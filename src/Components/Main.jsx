import React, { useEffect, useRef, useState } from "react";
import $ from "jquery";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Flickity from "flickity";
import "flickity/css/flickity.css";
import "../index.css";

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

  // Parallax scroll effects
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

  // Flickity slider initialization
  useEffect(() => {
    if (!page || !contentRef.current) return;
    let rafId = null;
    let timeoutId = null;
    let flktyInstance = null;

    const initFlickity = () => {
      const sliderEl = contentRef.current.querySelector(
        ".slider[data-flickity-options]"
      );
      if (!sliderEl) {
        console.warn("[Flickity] slider element not found");
        return;
      }

      // Skip if Flickity already initialized
      if (sliderEl.classList.contains("flickity-enabled") || sliderEl._flkty) {
        console.log("[Flickity] already initialized, skipping");
        return;
      }

      const raw = sliderEl.getAttribute("data-flickity-options") || "{}";
      let options = {};
      try {
        options = JSON.parse(raw.replace(/&quot;/g, '"'));
      } catch (e) {
        console.warn("[Flickity] parse options failed, using defaults", e);
        options = {};
      }

      const finalOptions = {
        cellSelector: ".banner",
        contain: true,
        pageDots: true,
        prevNextButtons: true,
        ...options,
      };

      try {
        flktyInstance = new Flickity(sliderEl, finalOptions);
        sliderEl._flkty = flktyInstance;
        console.log("[Flickity] initialized", finalOptions);
      } catch (e) {
        console.error("[Flickity] init error", e);
        return;
      }

      // Wait for all images to load then force resize
      const imgs = Array.from(sliderEl.querySelectorAll("img"));
      if (imgs.length === 0) {
        flktyInstance.resize();
        return;
      }

      let loaded = 0;
      const onImg = () => {
        loaded += 1;
        if (loaded >= imgs.length) {
          flktyInstance.resize();
        }
      };

      imgs.forEach((img) => {
        if (img.complete) {
          onImg();
        } else {
          img.addEventListener("load", onImg, { once: true });
          img.addEventListener("error", onImg, { once: true });
        }
      });
    };

    rafId = requestAnimationFrame(() => {
      timeoutId = setTimeout(initFlickity, 50);
    });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (timeoutId) clearTimeout(timeoutId);

      const sliderEl =
        contentRef.current?.querySelector(".slider[data-flickity-options]");
      if (sliderEl && sliderEl._flkty && sliderEl._flkty.destroy) {
        try {
          sliderEl._flkty.destroy();
        } catch (e) {
          console.warn("[Flickity] destroy failed", e);
        }
        sliderEl._flkty = null;
      }
    };
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