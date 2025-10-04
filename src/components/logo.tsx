import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  size?: "small" | "medium" | "large";
};

export function Logo({ className, size = "medium" }: LogoProps) {
  return (
    <h1
      className={cn(
        "font-headline font-bold tracking-tight text-primary",
        {
          "text-lg": size === "small",
          "text-2xl": size === "medium",
          "text-4xl": size === "large",
        },
        className
      )}
    >
      Kathaipom Social
    </h1>
  );
}
