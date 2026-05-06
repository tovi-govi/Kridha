import { MessageCircle } from "lucide-react";
import { waLink } from "@/lib/site";

export function ChatWidget() {
  return (
    <>
      <a
        href={waLink("Hi Kridha, I want to book a free demo.")}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-accent text-primary shadow-glow transition hover:scale-105"
        aria-label="WhatsApp Kridha"
      >
        <MessageCircle className="h-7 w-7" />
      </a>
      <a
        href="#book"
        className="fixed inset-x-4 bottom-5 z-40 rounded-full bg-primary px-6 py-4 text-center font-extrabold text-white shadow-glow md:hidden"
      >
        Enroll Now
      </a>
    </>
  );
}
