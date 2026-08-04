import * as React from "react";
import { cn } from "../../lib/tw";;
import { cva, type VariantProps } from "class-variance-authority";
const DivVariantProps = cva(
    "flex items-center justify-center",
    {
        variants: {
            variant: {
                default: "",
                isImage: " bg-cover bg-center",
                glass: [
                    "border border-white/25 bg-white/10 shadow-lg",
                    "backdrop-blur-[8px] -webkit-backdrop-blur-[18px]" // Đảm bảo hỗ trợ Safari
                ],
               black_transparent: "bg-gradient-to-b from-transparent from-[1%] to-black to-[99%]",
               card:"grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
               restaurant_template1_svg: "bg-svg-restaurant-template1 absolute p-4 gap-4 inset-0 pointer-events-none z-0  bg-repeat ",
                restaurant_template1: "bg-bg-restaurant-template1 ",
                bg_gray:"bg-gray-200 shadow-xl shadow-gray-300",
                bg_white:"bg-white shadow-xl shadow-gray-300 px-6 py-3",
                gradient_blue: "bg-gradient-to-br from-blue-50 to-blue-100/50 shadow-sm border border-blue-100",
                gradient_indigo: "bg-gradient-to-br from-indigo-50 to-indigo-100/50 shadow-sm border border-indigo-100",
                gradient_purple: "bg-gradient-to-br from-purple-50 to-purple-100/50 shadow-sm border border-purple-100",
                gradient_emerald: "bg-gradient-to-br from-emerald-50 to-emerald-100/50 shadow-sm border border-emerald-100",
                gradient_rose: "bg-gradient-to-br from-rose-50 to-rose-100/50 shadow-sm border border-rose-100",
                gradient_amber: "bg-gradient-to-br from-amber-50 to-amber-100/50 shadow-sm border border-amber-100"

              
            },
            shape: {
                circle: "rounded-full",
                square: "rounded-2xl",
                none: "",
                r_lg:"rounded-lg",
                r_xl:"rounded-xl",
            },
            size: {
                full_screen: "min-h-screen w-full",
                w80_hauto: "w-80",
                w100: "w-100",
                full: "w-full",
                h16: "w-full h-16",
                w8_h8: "w-8 h-8"
            },
            gap: {
                
                g1_2: "gap-x-1 gap-y-2",
                g2_3: "gap-x-2 gap-y-3",
                g3_4: "gap-x-3 gap-y-4",
                g4_5: "gap-x-4 gap-y-5",
                g5_6: "gap-x-5 gap-y-6",
            },
            vitri: {
                // Hướng ngang (Row)
                row_center: "flex-row items-center justify-center",
                row_between: "flex-row items-center justify-between",
                row_around: "flex-row items-center justify-around",
                row_start: "flex-row items-center justify-start",
                row_end: "flex-row items-center justify-end",
                row_top_between: "flex-row items-start justify-between",
                row_none: "flex-row items-start justify-start",
                
                // Hướng dọc (Col)
                col_center: "flex-col items-center justify-center",
                col_between: "flex-col items-center justify-between",
                col_around: "flex-col items-center justify-around",
                col_start: "flex-col items-center justify-start",
                col_end: "flex-col items-center justify-end",
                col_none: "flex-col items-start justify-start",
            },
            grids:{
                default:"",
                col_1:"grid grid-cols-1",
                col_2:"grid grid-cols-2",
                col_3:"grid grid-cols-3",
                col_4:"grid grid-cols-4",
            }
        },
        defaultVariants: {
            variant: "default",
            shape: "square",
        }
    }
)
interface DivProps extends React.ComponentPropsWithoutRef<"div">, VariantProps<typeof DivVariantProps> { }
const Div = React.forwardRef<HTMLDivElement, DivProps>(
    ({ className, variant, shape, size, gap,grids, vitri, ...props }, ref) => {
        return (
            <div

                className={cn(DivVariantProps({ variant, shape, size,grids, gap, vitri, className }))}
                ref={ref}
                {...props}
            />
        )
    }
);
Div.displayName = "Div"; // Quan trọng để debug trong React DevTools

export { Div };