import logo from "@/assets/kridha-logo.svg";

export function Logo({ className = "h-10 w-auto" }: { className?: string }) {
  return <img src={logo} alt="Kridha Software Solutions Private Limited" className={className} loading="eager" />;
}
