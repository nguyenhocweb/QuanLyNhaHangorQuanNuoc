"use client";

import React from "react";
import { FaGithub, FaLinkedin, FaGlobe, FaEnvelope, FaFacebook, FaCrown, FaCode, FaLaptopCode, FaPhoneAlt } from "react-icons/fa";
import { SiZalo } from "react-icons/si";

import FadeIn from "@/src/core/components/animation/FadeIn";
import { useGetPublicWebAuthors } from "../hook/useGetPublicWebAuthors";

export const WebAuthorsSection: React.FC = () => {
  const { data, isLoading } = useGetPublicWebAuthors();
  const authors = Array.isArray(data) ? data : (data as any)?.data || [];

  const containerRef = React.useRef<HTMLDivElement>(null);
  const [shouldAnimate, setShouldAnimate] = React.useState<boolean>(false);

  React.useEffect(() => {
    const checkOverflow = () => {
      if (!containerRef.current || authors.length === 0) return;
      // Kích thước ước tính của card (360px mobile, 400px sm/desktop) + khoảng cách gap 24px
      const isMobile = window.innerWidth < 640;
      const cardWidth = isMobile ? 360 : 400;
      const gap = 24;
      const totalWidth = authors.length * cardWidth + Math.max(0, authors.length - 1) * gap;
      const containerWidth = containerRef.current.clientWidth;

      // Chỉ kích hoạt animation nếu có nhiều hơn 1 item VÀ tổng chiều rộng các card vượt quá chiều rộng container/màn hình
      setShouldAnimate(authors.length > 1 && totalWidth > containerWidth);
    };

    checkOverflow();

    const resizeObserver = new ResizeObserver(() => {
      checkOverflow();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener("resize", checkOverflow);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", checkOverflow);
    };
  }, [authors.length]);

  if (!isLoading && authors.length === 0) {
    return null;
  }

  // Nhân bản mảng chỉ khi bật animation để tạo vòng lặp vô tận (Infinite Seamless Loop)
  const marqueeAuthors = shouldAnimate && authors.length > 0 ? [...authors, ...authors] : authors;

  return (
    <section className="w-full py-20 bg-gradient-to-b from-slate-900 via-gray-900 to-slate-950 text-white overflow-hidden relative z-10">
      {/* Background Glow Accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div ref={containerRef} className="w-full relative z-10">
        <FadeIn isFirstFolder={true}>
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 px-4 sm:px-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <FaLaptopCode className="w-4 h-4" />
              <span>Đội Ngũ Kỹ Sư & Sáng Lập</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Người Kiến Tạo Hệ Thống
            </h2>
            <p className="text-gray-400 text-sm sm:text-base mt-3">
              Đội ngũ kỹ sư phần mềm tâm huyết mang đến giải pháp quản lý nhà hàng & chuỗi F&B toàn diện, hiện đại và bảo mật.
            </p>
          </div>

          {/* Cards Display: Single Row Marquee if overflowing screen, or Static Centered if fitting */}
          {isLoading ? (
            <div className="flex gap-6 overflow-hidden px-6 max-w-7xl mx-auto justify-center">
              {[1, 2, 3].map((n) => (
                <div key={n} className="w-[360px] sm:w-[400px] h-96 bg-gray-800/50 rounded-2xl animate-pulse flex-shrink-0" />
              ))}
            </div>
          ) : shouldAnimate ? (
            <div className="relative w-full overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]">
              <div className="animate-marquee-authors flex items-stretch gap-6 w-max">
                {marqueeAuthors.map((author: any, index: number) => (
                  <AuthorCard key={`${author.id}-${index}`} author={author} />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center items-stretch gap-6 px-4 sm:px-6 max-w-7xl mx-auto py-4">
              {authors.map((author: any) => (
                <AuthorCard key={author.id} author={author} />
              ))}
            </div>
          )}
        </FadeIn>
      </div>

      {/* Hardware-Accelerated Marquee Animation Style */}
      <style jsx>{`
        @keyframes marqueeRightToLeft {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee-authors {
          animation: marqueeRightToLeft 45s linear infinite;
        }
        .animate-marquee-authors:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

interface AuthorCardProps {
  author: any;
}

const AuthorCard: React.FC<AuthorCardProps> = ({ author }) => {
  return (
    <div
      className={`w-[360px] sm:w-[400px] max-w-[calc(100vw-32px)] flex-shrink-0 group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl backdrop-blur-xl border transition-all duration-300 ${
        author.isLeader
          ? "bg-gradient-to-b from-gray-800/95 via-gray-850/90 to-gray-900/95 border-amber-500/50 shadow-[0_0_30px_-5px_rgba(245,158,11,0.25)] hover:border-amber-500"
          : "bg-gray-800/70 hover:bg-gray-800/90 border-gray-700/60 hover:border-gray-600 shadow-sm"
      } hover:-translate-y-2`}
    >
      {/* Leader Badge */}
      {author.isLeader && (
        <div className="absolute -top-3.5 left-6 inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-extrabold text-[11px] rounded-full shadow-md">
          <FaCrown className="w-3 h-3 text-slate-950" />
          <span>Project Leader</span>
        </div>
      )}

      <div>
        {/* Profile Header: Avatar + Name + Title */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-tr from-orange-500 to-amber-400 p-0.5 shadow-md flex-shrink-0">
            {author.avatarUrl ? (
              <div className="relative w-full h-full rounded-[14px] overflow-hidden bg-gray-900">
                <img
                  src={author.avatarUrl}
                  alt={author.fullName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ) : (
              <div className="w-full h-full rounded-[14px] bg-gray-800 flex items-center justify-center text-white font-black text-xl">
                {author.fullName?.[0]?.toUpperCase() || "D"}
              </div>
            )}
          </div>

          <div className="overflow-hidden">
            <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors truncate">
              {author.fullName}
            </h3>
            <p className="text-xs text-orange-400 font-semibold tracking-wide truncate">
              {author.roleTitle || "Software Engineer"}
            </p>
          </div>
        </div>

        {/* Bio */}
        {author.bio && (
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-4 line-clamp-3">
            {author.bio}
          </p>
        )}

        {/* Tech Stack Tags */}
        {author.techStack && author.techStack.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-1 text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-2">
              <FaCode className="w-3 h-3 text-amber-400" />
              <span>Tech Stack</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {author.techStack.map((tech: string, idx: number) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-gray-700/60 text-gray-200 border border-gray-600/50"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Contributions */}
        {author.contributions && author.contributions.length > 0 && (
          <div className="mb-4">
            <div className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1.5">
              Phụ trách chính:
            </div>
            <ul className="space-y-1 text-xs text-gray-300">
              {author.contributions.slice(0, 3).map((item: string, idx: number) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-orange-400 font-bold">•</span>
                  <span className="line-clamp-1">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Social & Portfolio Links */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-700/50 text-gray-400 mt-2">
        {author.githubUrl && (
          <a
            href={author.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="p-2 hover:text-white hover:bg-gray-700/70 rounded-xl transition-all"
            aria-label="GitHub"
          >
            <FaGithub className="w-4 h-4" />
          </a>
        )}
        {author.linkedinUrl && (
          <a
            href={author.linkedinUrl}
            target="_blank"
            rel="noreferrer"
            className="p-2 hover:text-sky-400 hover:bg-gray-700/70 rounded-xl transition-all"
            aria-label="LinkedIn"
          >
            <FaLinkedin className="w-4 h-4" />
          </a>
        )}
        {author.portfolioUrl && (
          <a
            href={author.portfolioUrl}
            target="_blank"
            rel="noreferrer"
            className="p-2 hover:text-amber-400 hover:bg-gray-700/70 rounded-xl transition-all"
            aria-label="Portfolio Website"
          >
            <FaGlobe className="w-4 h-4" />
          </a>
        )}
        {author.facebookUrl && (
          <a
            href={author.facebookUrl}
            target="_blank"
            rel="noreferrer"
            className="p-2 hover:text-blue-400 hover:bg-gray-700/70 rounded-xl transition-all"
            aria-label="Facebook"
          >
            <FaFacebook className="w-4 h-4" />
          </a>
        )}
        {author.hasZalo && (
          <a
            href={author.zaloUrl || `https://zalo.me/${(author.phone || "").replace(/\D/g, "")}`}
            target="_blank"
            rel="noreferrer"
            className="p-2 hover:text-blue-400 hover:bg-gray-700/70 rounded-xl transition-all"
            aria-label="Zalo"
            title="Kết nối Zalo"
          >
            <SiZalo className="w-4 h-4 text-blue-400" />
          </a>
        )}
        {author.phone && (
          <a
            href={`tel:${author.phone}`}
            className="p-2 hover:text-emerald-400 hover:bg-gray-700/70 rounded-xl transition-all"
            aria-label="Phone"
            title={`Gọi ${author.phone}`}
          >
            <FaPhoneAlt className="w-3.5 h-3.5" />
          </a>
        )}
        {author.email && (
          <a
            href={`mailto:${author.email}`}
            className="p-2 hover:text-orange-400 hover:bg-gray-700/70 rounded-xl transition-all"
            aria-label="Email"
          >
            <FaEnvelope className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
};
