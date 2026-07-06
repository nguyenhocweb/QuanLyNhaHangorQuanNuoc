import * as React from "react";
import { cn } from "../../lib/tw";
import { cva, type VariantProps } from "class-variance-authority";
const LabelVariantProps = cva(
    "flex text-start justify-start",
    {
        variants: {
            variant: {
                default: "text-black",
                black:"text-black"
                
            },
            shape: {
                circle: "rounded-full",
                square: "rounded-2xl",
            },
            size: {
              
                w80_hauto: "w-80",
                w100:"w-100"
            },
           
        },
        defaultVariants: {
            variant: "default",
            shape: "square",
        }
    }
)
interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement>, VariantProps<typeof LabelVariantProps> { }
const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
    ({ className, variant, shape, size, ...props },ref) => {
        return (
            <label

                className={cn(LabelVariantProps({ variant, shape, size, className }))}
                ref={ref}
                {...props}
           />
        )
    }
);
Label.displayName = "Label"; // Quan trọng để debug trong React DevTools

export { Label};