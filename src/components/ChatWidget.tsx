import { motion } from "framer-motion";

export function ChatWidget() {
  return (
    <motion.a
      href="#book"
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.55, type: "spring", stiffness: 180, damping: 18 }}
      whileTap={{ scale: 0.96 }}
      className="fixed inset-x-4 bottom-5 z-40 rounded-full bg-primary px-6 py-4 text-center font-extrabold text-white shadow-glow md:hidden"
    >
      Enroll Now
    </motion.a>
  );
}
