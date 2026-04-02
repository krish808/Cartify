import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "@cartify/ui";
import {
  MdSmartphone,
  MdLaptop,
  MdTv,
  MdHeadphones,
  MdWatch,
  MdFlashOn,
} from "react-icons/md";
import { MdCheckroom } from "react-icons/md";

const slides = [
  {
    id: 1,
    tag: "BIGGEST SALE OF THE YEAR",
    title: "Cartify Big\nBillion Days",
    subtitle: "Up to 80% off on Electronics, Fashion, Home & more",
    bg: "from-[#2874f0] to-[#0950a1]",
    highlights: [
      { icon: MdSmartphone, label: "Mobiles", offer: "Up to 40% off" },
      { icon: MdLaptop, label: "Laptops", offer: "Up to 35% off" },
      { icon: MdCheckroom, label: "Fashion", offer: "Up to 80% off" },
    ],
  },
  {
    id: 2,
    tag: "FLASH SALE LIVE",
    title: "Electronics\nMega Fest",
    subtitle: "Top brands. Unbeatable prices. Limited stock.",
    bg: "from-[#e53935] to-[#b71c1c]",
    highlights: [
      { icon: MdTv, label: "TVs", offer: "Up to 50% off" },
      { icon: MdHeadphones, label: "Audio", offer: "Up to 60% off" },
      { icon: MdWatch, label: "Wearables", offer: "Up to 45% off" },
    ],
  },
  {
    id: 3,
    tag: "NEW ARRIVALS",
    title: "Summer\nCollection 2026",
    subtitle: "Fresh styles for the new season.",
    bg: "from-[#11998e] to-[#0b6e65]",
    highlights: [
      { icon: MdCheckroom, label: "Women", offer: "Up to 70% off" },
      { icon: MdCheckroom, label: "Men", offer: "Up to 65% off" },
      { icon: MdFlashOn, label: "Flash Picks", offer: "Up to 55% off" },
    ],
  },
];

export default function HeroBanner() {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setActive((p) => (p + 1) % slides.length),
      4000,
    );
    return () => clearInterval(t);
  }, []);

  const slide = slides[active];

  return (
    <div className="mb-3 rounded-sm overflow-hidden">
      <div
        className={`bg-gradient-to-r ${slide.bg} relative h-[260px] flex items-center transition-all duration-500`}
      >
        <Container>
          <div className="flex items-center justify-between">
            {/* Left */}
            <div className="flex-1">
              <span className="bg-[#ff9f00] text-white text-[11px] font-medium px-3 py-1 rounded-sm tracking-widest inline-block mb-3">
                {slide.tag}
              </span>
              <h1 className="text-white text-3xl font-medium leading-tight mb-2 whitespace-pre-line">
                {slide.title}
              </h1>
              <p className="text-white/80 text-sm mb-5">{slide.subtitle}</p>
              <button
                onClick={() => navigate("/products")}
                className="bg-white text-[#2874f0] text-sm font-medium px-7 py-2.5 rounded-sm hover:bg-gray-50 transition"
              >
                Shop Now
              </button>
            </div>

            {/* Right highlights */}
            <div className="hidden md:flex gap-4 items-end">
              {slide.highlights.map((h, i) => {
                const Icon = h.icon;
                return (
                  <div
                    key={i}
                    onClick={() => navigate("/products")}
                    className="bg-white/10 hover:bg-white/20 transition rounded-lg px-5 py-4 text-center text-white cursor-pointer"
                  >
                    <div className="flex justify-center mb-1">
                      <Icon size={32} />
                    </div>
                    <div className="text-xs opacity-80 mb-1">{h.label}</div>
                    <div className="text-xs font-medium text-yellow-300">
                      {h.offer}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>

        {/* Decorative circles */}
        <div className="absolute w-72 h-72 rounded-full bg-white/5 -top-16 -right-16 pointer-events-none" />
        <div className="absolute w-44 h-44 rounded-full bg-white/5 -bottom-10 right-32 pointer-events-none" />
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 py-2 bg-white">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === active ? "bg-[#2874f0] w-4" : "bg-gray-300 w-2"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
