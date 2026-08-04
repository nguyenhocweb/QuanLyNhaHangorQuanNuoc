import * as React from "react";
import { cn } from "../../lib/tw";
import { cva, type VariantProps } from "class-variance-authority";
const SelectVariantProps = cva(
    "",
    {
        variants: {
            variant: {
                default: "flex border border-gray-400 bg-white/3 backdrop-blur-[10px] px-2 py-2 text-sm text-black transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30 disabled:cursor-not-allowed disabled:opacity-50",
                gray: [" flex items-center justify-center  rounded-xl text-black text-sm font-medium ",
                    "bg-gradient-to-r from-gray-200 to-gray-300",
                    "  shadow-md",
                    "  transition-all duration-300",
                    " hover:from-gray-300 hover:to-gray-400",
                    "hover:shadow-lg hover:scale-[1.03]",
                    "active:scale-95"
                ],
            },
            shape: {
                circle: "rounded-full",
                square: "rounded-lg",
            },
            sizea:{
                full:"w-full",
                 p2_1:"px-2 py-1",
                p3_2:"px-3 py-2",
                p4_3:"px-4 py-3",
                p4_2:"px-4 py-2",
            }
        },
        defaultVariants: {
            variant:"default",
            shape:"square",
        }
    }
)
interface SelectProps extends React.ComponentPropsWithoutRef<"select">,VariantProps<typeof SelectVariantProps>{}
const Select=React.forwardRef<HTMLSelectElement , SelectProps>(
    ({ className, variant,shape,sizea, ...props }, ref)=>{
        return (
            <select

          
              className={cn(SelectVariantProps({variant,shape,sizea,className}))}
              ref={ref}
              {...props}
            />
        )
    }
);
Select.displayName = "Select"; // Quan trọng để debug trong React DevTools

export {Select };