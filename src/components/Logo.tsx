import k1 from "@/assets/k1.svg";
import k2 from "@/assets/k2.svg";

export function Logo({ className = "h-10 w-auto", variant = "default" }: { className?: string; variant?: "navbar" | "default" }) {
  const src = variant === "navbar" ? k1 : k2;
  return <img src={src} alt="Kridha Software Solutions Private Limited" className={className} loading="eager" />;
}