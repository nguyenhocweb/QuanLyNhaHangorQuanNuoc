import * as React from "react";
import { cn } from "../../lib/tw";
import { cva, type VariantProps } from "class-variance-authority";
const InputVariantProps = cva(
    " transition duration-[999999s] ",
    {
        variants: {
            variant: {
                default: "flex border border-gray-400 bg-white/3 backdrop-blur-[10px] px-2 py-2 text-sm text-black transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30 disabled:cursor-not-allowed disabled:opacity-50",
            },
            shape: {
                circle: "rounded-full",
                square: "rounded-lg",
            },
            sizea:{
                full:"w-full"
            }
        },
        defaultVariants: {
            variant:"default",
            shape:"square",
        }
    }
)
interface InputProps extends React.ComponentPropsWithoutRef<"input">,VariantProps<typeof InputVariantProps>{}
const Input=React.forwardRef<HTMLInputElement , InputProps>(
    ({ className, variant,shape,type,sizea, ...props }, ref)=>{
        return (
            <input

              type={type??"text"}
              className={cn(InputVariantProps({variant,shape,sizea,className}))}
              ref={ref}
              {...props}
            />
        )
    }
);
Input.displayName = "Input"; // Quan trọng để debug trong React DevTools

export { Input };