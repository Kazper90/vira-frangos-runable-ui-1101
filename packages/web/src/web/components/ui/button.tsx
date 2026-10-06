import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-[7px] whitespace-nowrap font-semibold transition-[background,color,border,box-shadow,transform] duration-200 ease-vf disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        /** VF Core primary — lime. Use for the main intelligence CTA. */
        primary: "bg-vf-lime text-vf-lime-ink hover:bg-vf-lime-hover",
        /** Figma secondary: transparent, 1px white@0.18 stroke, #999 text. */
        secondary: "border border-vf-line-strong bg-transparent font-medium text-[#999999] hover:border-white/30 hover:text-vf-text",
        ghost: "font-medium text-vf-text-3 hover:text-vf-text",
        outline: "border border-vf-line-strong font-medium text-vf-text hover:bg-white/5",
        /** Community identity — red. Never for VF intelligence actions. */
        community: "bg-vf-red text-white hover:bg-vf-red-hover",
        link: "text-vf-lime underline-offset-4 hover:underline px-0",
      },
      size: {
        sm: "h-8 rounded-vf-xs px-3.5 text-xs",
        md: "h-[38px] rounded-vf-sm px-5 text-[13px]",
        lg: "h-[42px] rounded-vf-sm px-5 text-[13px] md:h-[39px]",
        icon: "size-10 rounded-vf-sm",
        "icon-sm": "size-8 rounded-vf-xs",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  type,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      type={asChild ? undefined : (type ?? "button")}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
