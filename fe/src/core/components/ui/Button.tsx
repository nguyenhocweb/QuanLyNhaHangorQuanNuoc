import * as React from "react";
import { cn } from "../../lib/tw";
import { cva, type VariantProps } from "class-variance-authority";
const ButtonVariantProps = cva(
    "cursor-pointer ",
    {
        variants: {
            variant: {
                default: "",
                icon: "border-none ",
                mau1: [
                    "border border-red-500 shadow-[0_0_10px_0px_red] backdrop-blur-[10px]",
                    "hover:bg-red-500/20"
                ],
                google: "border border-red-500 shadow-[0_0_10px_0px_red] hover:bg-red-500/50",
                fb: "border border-blue-500 shadow-[0_0_10px_0px_blue] hover:bg-blue-500/50",
                green: [" flex items-center justify-center   text-white text-sm font-medium ",
                    "bg-gradient-to-r from-green-500 to-green-600",
                    "  shadow-md",
                    "  transition-all duration-300",
                    " hover:from-green-600 hover:to-green-700",
                    "hover:shadow-lg hover:scale-[1.03]",
                    "active:scale-95"
                ],
                blue: [" flex items-center justify-center   text-white text-sm font-medium ",
                    "bg-gradient-to-r from-blue-500 to-blue-600",
                    "  shadow-md",
                    "  transition-all duration-300",
                    " hover:from-blue-600 hover:to-blue-700",
                    "hover:shadow-lg hover:scale-[1.03]",
                    "active:scale-95"
                ],
                white: [" flex items-center justify-center   text-black text-sm font-medium ",
                    "bg-gradient-to-r from-white to-gray-200",
                    "  shadow-md",
                    "  transition-all duration-300",
                    " hover:from-gray-200 hover:to-gray-300",
                    "hover:shadow-lg hover:scale-[1.03]",
                    "active:scale-95"
                ],
                red: [" flex items-center justify-center   text-white text-sm font-medium ",
                    "bg-gradient-to-r from-red-500 to-red-600",
                    "  shadow-md",
                    "  transition-all duration-300",
                    " hover:from-red-600 hover:to-red-700",
                    "hover:shadow-lg hover:scale-[1.03]",
                    "active:scale-95"
                ],
                indigo: [" flex items-center justify-center text-white text-sm font-medium ",
                    "bg-gradient-to-r from-indigo-500 to-indigo-600",
                    "  shadow-md",
                    "  transition-all duration-300",
                    " hover:from-indigo-600 hover:to-indigo-700",
                    "hover:shadow-lg hover:scale-[1.03]",
                    "active:scale-95"
                ],
                purple: [" flex items-center justify-center text-white text-sm font-medium ",
                    "bg-gradient-to-r from-purple-500 to-purple-600",
                    "  shadow-md",
                    "  transition-all duration-300",
                    " hover:from-purple-600 hover:to-purple-700",
                    "hover:shadow-lg hover:scale-[1.03]",
                    "active:scale-95"
                ],
                pink: [" flex items-center justify-center text-white text-sm font-medium ",
                    "bg-gradient-to-r from-pink-500 to-pink-600",
                    "  shadow-md",
                    "  transition-all duration-300",
                    " hover:from-pink-600 hover:to-pink-700",
                    "hover:shadow-lg hover:scale-[1.03]",
                    "active:scale-95"
                ],
                orange: [" flex items-center justify-center text-white text-sm font-medium ",
                    "bg-gradient-to-r from-orange-500 to-orange-600",
                    "  shadow-md",
                    "  transition-all duration-300",
                    " hover:from-orange-600 hover:to-orange-700",
                    "hover:shadow-lg hover:scale-[1.03]",
                    "active:scale-95"
                ],
                teal: [" flex items-center justify-center text-white text-sm font-medium ",
                    "bg-gradient-to-r from-teal-500 to-teal-600",
                    "  shadow-md",
                    "  transition-all duration-300",
                    " hover:from-teal-600 hover:to-teal-700",
                    "hover:shadow-lg hover:scale-[1.03]",
                    "active:scale-95"
                ],
                amber: [" flex items-center justify-center text-white text-sm font-medium ",
                    "bg-gradient-to-r from-amber-500 to-amber-600",
                    "  shadow-md",
                    "  transition-all duration-300",
                    " hover:from-amber-600 hover:to-amber-700",
                    "hover:shadow-lg hover:scale-[1.03]",
                    "active:scale-95"
                ],
                gray: [" flex items-center justify-center  text-black text-sm font-medium ",
                    "bg-gradient-to-r from-gray-200 to-gray-300",
                    "  shadow-md",
                    "  transition-all duration-300",
                    " hover:from-gray-300 hover:to-gray-400",
                    "hover:shadow-lg hover:scale-[1.03]",
                    "active:scale-95"
                ],
                gray_hover: [" flex items-center justify-center  rounded-xl text-black text-sm font-medium ",
                    "bg-gradient-to-r ",
                    "  transition-all duration-300",
                    " hover:from-gray-300 hover:to-gray-400",
                    "hover:shadow-lg hover:scale-[1.03]",
                    "active:scale-95"
                ],
                black: [" flex items-center justify-center  rounded-xl text-white text-sm font-medium ",
                    "bg-gradient-to-r from-gray-500 to-gray-600",
                    "  shadow-md",
                    "  transition-all duration-300",
                    " hover:from-gray-600 hover:to-gray-700",
                    "hover:shadow-lg hover:scale-[1.03]",
                    "active:scale-95"
                ],
                green_shadow: [
                    "flex items-center justify-center bg-white text-black   relative",
                    "before:content-[''] ",
                    "before:absolute before:-inset-1 before:-z-1  ",
                    "before:bg-gradient-to-r before:from-green-400 before:to-[#462f82] ",
                    "before:opacity-70 before:blur-md ",
                    "before:transition-opacity before:duration-500 ",
                    "hover:before:opacity-100"
                ],
                text_green: "text-green-500 hover:text-green-700",
                tabel_gray:" bg-gray-200 text-gray-700",
                tabel_green:"  bg-green-500 text-white ",
                tabel_red:" bg-red-500 text-white",
                outline:"flex items-center justify-center bg-transparent border border-gray-500  hover:bg-gray-100"

            },
            bordera:{
                default:"",
                yellow:" border border-yellow-400 shadow-[0_0_6px_rgba(250,204,21,0.6)]"
            },
            shape: {
                circle: "rounded-full",
                square: "rounded-lg",
                before_Circle:"before:rounded-full rounded-full",
                before_Square:"before:rounded-lg rounded-lg",
            },
            sizea: {
                full: "w-full",
                p2_1: "px-2 py-1",
                p3_2: "px-3 py-2",
                p3_1: "px-3 py-1",
                p4_3: "px-4 py-3",
                p5_3: "px-5 py-3",
                p4_2: "px-4 py-2",
                p5_2: "px-5 py-2",
            },

        },
        defaultVariants: {
            variant: "default",
            shape: "square",
        }
    }
)
interface ButtonProps extends React.ComponentPropsWithoutRef<"button">, VariantProps<typeof ButtonVariantProps> { }
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, shape, type, bordera,sizea, ...props }, ref) => {
        return (
            <button

                type={type ?? "button"}
                className={cn(ButtonVariantProps({ variant, bordera,shape, sizea, className }))}
                ref={ref}
                {...props}
            />
        )
    }
);
Button.displayName = "Button"; // Quan trọng để debug trong React DevTools

export { Button };