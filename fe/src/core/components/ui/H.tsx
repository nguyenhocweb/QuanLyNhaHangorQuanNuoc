import * as React from "react";
import { cn } from "../../lib/tw";
import { cva, type VariantProps } from "class-variance-authority";

const HVariantProps = cva(
    "flex transition-all duration-300 ",
    {
        variants: {
            variant: {
                default: "text-gray-400",
                // Shadow mờ rộng màu trắng/xanh theo phong cách Glassmorphism
                glow: "text-white shadow-[0_0_20px_rgba(255,255,255,0.3)] bg-white/10 backdrop-blur-md border border-white/20",
                // Shadow mờ rộng màu sắc rực rỡ (Neon)
                neon: "text-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.4)] border border-cyan-500/50 bg-cyan-500/5",
                truncate_1line: "line-clamp-1 h-7",
                truncate_2line: "line-clamp-2 h-14",
                text_black: "font-semibold text-gray-900 text-lg",
                text_green: "text-green-600 font-semibold tracking-wide",
                text_Ocean: "bg-ocean-gradient bg-clip-text text-transparent",
                text_FireIce: "bg-fire-ice bg-clip-text text-transparent",
            },
            line: {
                truncate_1line: "line-clamp-1 h-7",
                truncate_2line: "line-clamp-2 h-14",
            },
            fonts: {
                default: "font-sans",
                serif: "font-serif italic",
                mono: "font-mono",

            },
            shape: {
                circle: "rounded-full px-4 py-2",
                square: "rounded-2xl px-2 py-1",
            },
            size: {
                w80_hauto: "w-80",
                w100: "w-full", // Tailwind v4/v3 dùng w-full cho 100%
            },
        },
        defaultVariants: {

            fonts: "default",
            variant: "default",
            shape: "square",
        }
    }
)

// Sửa Interface để khớp với thẻ <h1>, <h2>, v.v.
interface HProps extends React.HTMLAttributes<HTMLHeadingElement>, VariantProps<typeof HVariantProps> {
    level?: 1 | 2 | 3 | 4 | 5 | 6;
}

const H = React.forwardRef<HTMLHeadingElement, HProps>(
    ({ className, variant, shape, size, fonts, line, level = 1, ...props }, ref) => {
        const Comp = `h${level}` as any;
        return (
            <Comp
                className={cn(HVariantProps({ variant, shape, size, fonts, line, className }))}
                ref={ref}
                {...props}
            />
        )
    }
);

H.displayName = "H";

export { H };