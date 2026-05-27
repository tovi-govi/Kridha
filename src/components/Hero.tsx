import { site } from "@/lib/site";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Laptop, PlayCircle, UserRoundCheck } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

const SCRATCH_RADIUS = 15;
const REVEAL_THRESHOLD = 0.58;
const HERO_TITLE_PARTS = ["🚀", "Become", "Job-Ready", "in"];
const FEATURE_ITEMS = ["React + Node", "Python + AWS", "Interview Training"];
const REVEAL_PARTICLES = [
  { x: -42, y: -22, delay: 0 },
  { x: -18, y: -36, delay: 0.03 },
  { x: 18, y: -34, delay: 0.05 },
  { x: 44, y: -18, delay: 0.08 },
  { x: -34, y: 18, delay: 0.1 },
  { x: 34, y: 20, delay: 0.12 },
];

function AnimatedHeroTitle() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.h1
      className="mt-3 max-w-3xl text-2xl font-extrabold leading-tight sm:mt-5 sm:text-4xl sm:leading-[1.05] md:text-5xl lg:text-7xl"
      initial={reduceMotion ? false : "hidden"}
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.08, delayChildren: 0.08 } },
      }}
    >
      {HERO_TITLE_PARTS.map((part) => (
        <motion.span
          key={part}
          className="mr-[0.18em] inline-block"
          variants={{
            hidden: { opacity: 0, y: 18 },
            show: { opacity: 1, y: 0 },
          }}
          transition={{ type: "spring", stiffness: 420, damping: 30 }}
        >
          {part}
        </motion.span>
      ))}
      <motion.span
        className="inline-block text-accent"
        variants={{
          hidden: { opacity: 0, scale: 0.76, y: 16 },
          show: { opacity: 1, scale: 1, y: 0 },
        }}
        transition={{
          scale: { type: "spring", stiffness: 380, damping: 18, delay: 0.42 },
        }}
      >
        6 Months
      </motion.span>
    </motion.h1>
  );
}

function AnimatedCTA() {
  return (
    <motion.a
      href="#book"
      className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-xs font-extrabold text-primary shadow-glow transition active:scale-95 sm:w-auto sm:px-7 sm:py-4 sm:text-base"
      whileHover={{ scale: 1.035, y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 450, damping: 24 }}
    >
      Book Free Demo
      <motion.span
        className="inline-flex"
        initial={false}
        whileHover={{ x: 4 }}
        transition={{ type: "spring", stiffness: 520, damping: 20 }}
      >
        <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
      </motion.span>
    </motion.a>
  );
}

function LiveBadge() {
  return (
    <span className="relative flex-shrink-0 rounded-full bg-accent/20 px-2 py-0.5 text-[0.6rem] font-extrabold text-emerald-700 sm:px-3 sm:py-1 sm:text-xs">
      LIVE
    </span>
  );
}

function FeaturePill({ label, index }: { label: string; index: number }) {
  return (
    <motion.div
      className="group flex items-center gap-2 rounded-lg border border-border p-2 sm:gap-3 sm:rounded-2xl sm:p-3"
      initial={{ opacity: 0, x: 18 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 4, borderColor: "rgba(0,230,118,0.45)" }}
      transition={{ type: "spring", stiffness: 380, damping: 30, delay: 0.58 + index * 0.1 }}
    >
      <motion.span
        className="grid h-4 w-4 flex-shrink-0 place-items-center sm:h-5 sm:w-5"
        whileHover={{ scale: 1.15, rotate: -8 }}
      >
        <UserRoundCheck className="h-4 w-4 text-emerald-600 transition group-hover:text-accent sm:h-5 sm:w-5" />
      </motion.span>
      <span className="text-xs font-bold leading-tight sm:text-sm">{label}</span>
    </motion.div>
  );
}

function drawScratchCover(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const width = Math.max(1, Math.round(rect.width));
  const height = Math.max(1, Math.round(rect.height));

  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.globalCompositeOperation = "source-over";

  const base = ctx.createLinearGradient(0, 0, width, height);
  base.addColorStop(0, "#dce8ef");
  base.addColorStop(0.42, "#8295a4");
  base.addColorStop(1, "#edf5f7");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, width, height);

  const shine = ctx.createLinearGradient(0, 0, width, 0);
  shine.addColorStop(0, "rgba(255,255,255,0)");
  shine.addColorStop(0.5, "rgba(255,255,255,0.52)");
  shine.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = shine;
  ctx.translate(width * 0.18, 0);
  ctx.rotate(-0.18);
  ctx.fillRect(width * 0.05, -height, width * 0.28, height * 3);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  ctx.strokeStyle = "rgba(255,255,255,0.22)";
  ctx.lineWidth = 1;
  for (let x = -height; x < width + height; x += 10) {
    ctx.beginPath();
    ctx.moveTo(x, height);
    ctx.lineTo(x + height, 0);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(8,17,31,0.64)";
  ctx.font = "800 10px Montserrat, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("SCRATCH TO REVEAL", width / 2, height / 2);
}

function getScratchPosition(canvas: HTMLCanvasElement, clientX: number, clientY: number) {
  const rect = canvas.getBoundingClientRect();

  return {
    x: clientX - rect.left,
    y: clientY - rect.top,
  };
}

function getScratchedRatio(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx || !canvas.width || !canvas.height) return 0;

  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  let cleared = 0;

  for (let index = 3; index < pixels.length; index += 4) {
    if (pixels[index] < 24) cleared += 1;
  }

  return cleared / (pixels.length / 4);
}

function ScratchCardPrice({ onReveal }: { onReveal?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const scratchCountRef = useRef(0);
  const [isScratching, setIsScratching] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  const resetCover = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;

    drawScratchCover(canvas);
  }, [isRevealed]);

  const scratchAt = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx || isRevealed) return;

      const point = getScratchPosition(canvas, clientX, clientY);
      const previousPoint = lastPointRef.current || point;

      ctx.globalCompositeOperation = "destination-out";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = SCRATCH_RADIUS * 2;
      ctx.beginPath();
      ctx.moveTo(previousPoint.x, previousPoint.y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(point.x, point.y, SCRATCH_RADIUS, 0, Math.PI * 2);
      ctx.fill();

      lastPointRef.current = point;
      scratchCountRef.current += 1;

      if (scratchCountRef.current % 7 === 0 && getScratchedRatio(canvas) > REVEAL_THRESHOLD) {
        setIsRevealed(true);
        onReveal?.();
      }
    },
    [isRevealed, onReveal],
  );

  useEffect(() => {
    resetCover();
    window.addEventListener("resize", resetCover);

    return () => window.removeEventListener("resize", resetCover);
  }, [resetCover]);

  return (
    <motion.div
      className="relative mt-1 w-full max-w-[13.75rem] select-none rounded-xl border border-accent/20 bg-[#071a36] p-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06),0_14px_35px_-24px_rgba(0,230,118,0.7)]"
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 320, damping: 24, delay: 0.18 }}
    >
      <div className="relative overflow-hidden rounded-lg bg-primary px-3 py-2">
        <div className="relative z-0">
          <p className="text-[0.58rem] font-extrabold uppercase tracking-[0.14em] text-accent/80">
            Your discounted price
          </p>
          <motion.div
            className="leading-none text-2xl font-extrabold text-accent sm:text-3xl"
            animate={isRevealed ? { scale: [1, 1.08, 1], y: [0, -2, 0] } : { scale: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            ₹{site.feeINR.toLocaleString("en-IN")}
          </motion.div>
          <p className="mt-1 text-[0.62rem] font-semibold text-white/62">
            Save ₹{(site.originalFeeINR - site.feeINR).toLocaleString("en-IN")}
          </p>
        </div>

        <motion.canvas
          ref={canvasRef}
          className={
            isRevealed
              ? "pointer-events-none absolute inset-0 z-10 h-full w-full touch-none opacity-0 transition-opacity duration-500"
              : "absolute inset-0 z-10 h-full w-full cursor-grab touch-none rounded-lg active:cursor-grabbing"
          }
          initial={false}
          animate={isRevealed ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.45 }}
          onPointerDown={(event: ReactPointerEvent<HTMLCanvasElement>) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            lastPointRef.current = null;
            setIsScratching(true);
            scratchAt(event.clientX, event.clientY);
          }}
          onPointerMove={(event: ReactPointerEvent<HTMLCanvasElement>) => {
            if (isScratching) scratchAt(event.clientX, event.clientY);
          }}
          onPointerUp={(event: ReactPointerEvent<HTMLCanvasElement>) => {
            event.currentTarget.releasePointerCapture(event.pointerId);
            setIsScratching(false);
            lastPointRef.current = null;
          }}
          onPointerCancel={() => {
            setIsScratching(false);
            lastPointRef.current = null;
          }}
          aria-label="Scratch to reveal discounted price"
        />
        {!isRevealed && (
          <div
            className="pointer-events-none absolute inset-0 z-20 grid place-items-center rounded-lg"
            aria-hidden="true"
          >
            <span className="h-7 w-16 rounded-full border border-white/45 bg-white/20 shadow-[0_0_18px_rgba(255,255,255,0.28)]" />
          </div>
        )}
        {isRevealed && (
          <div
            className="pointer-events-none absolute inset-0 z-20 grid place-items-center"
            aria-hidden="true"
          >
            {REVEAL_PARTICLES.map((particle, index) => (
              <motion.span
                key={`${particle.x}-${particle.y}-${index}`}
                className="absolute h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_12px_rgba(0,230,118,0.8)]"
                initial={{ opacity: 0, scale: 0.2, x: 0, y: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0.2, 1, 0.4], x: particle.x, y: particle.y }}
                transition={{ duration: 0.72, delay: particle.delay, ease: "easeOut" }}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function PriceReveal() {
  const reduceMotion = useReducedMotion();
  const [isDiscountRevealed, setIsDiscountRevealed] = useState(false);
  const originalPrice = `₹${site.originalFeeINR.toLocaleString("en-IN")}`;
  const savings = site.originalFeeINR - site.feeINR;

  if (reduceMotion) {
    return (
      <>
        <div className="mt-2 inline-flex items-center gap-2">
          <span className="text-xs sm:text-sm text-white/50 line-through">{originalPrice}</span>
          <span className="rounded-full border border-accent/20 bg-accent/10 px-2 py-0.5 text-[0.58rem] font-extrabold text-accent">
            Save ₹{savings.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="mt-0.5 text-xl font-extrabold text-accent sm:text-3xl">
          ₹{site.feeINR.toLocaleString("en-IN")}
        </div>
      </>
    );
  }

  return (
    <>
      <motion.div
        className="mt-2 inline-flex items-center gap-2"
        initial={{ opacity: 0.72 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, delay: 0.1 }}
      >
        <span className="relative inline-flex text-xs text-white/50 sm:text-sm">
          {originalPrice}
          <motion.span
            className="absolute -left-1 -right-1 top-1/2 h-0.5 origin-left rounded-full bg-gradient-to-r from-transparent via-white/90 to-transparent"
            initial={{ scaleX: 0, rotate: -4 }}
            animate={{ scaleX: 1, rotate: -4 }}
            transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1], delay: 0.32 }}
            aria-hidden="true"
          />
        </span>
        {isDiscountRevealed && (
          <motion.span
            className="rounded-full border border-accent/20 bg-accent/10 px-2 py-0.5 text-[0.58rem] font-extrabold text-accent shadow-[0_0_18px_rgba(0,230,118,0.2)] sm:text-[0.65rem]"
            initial={{ opacity: 0, scale: 0.82, y: 2 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 520, damping: 24 }}
          >
            Save ₹{savings.toLocaleString("en-IN")}
          </motion.span>
        )}
      </motion.div>

      <ScratchCardPrice onReveal={() => setIsDiscountRevealed(true)} />
    </>
  );
}

export function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="relative overflow-hidden bg-primary text-white"
      style={{ colorScheme: "normal" }}
    >
      <div className="absolute inset-0 opacity-15 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:30px_30px]" />
      <div className="absolute -right-20 top-24 h-48 w-48 rounded-full bg-accent/25 blur-3xl sm:h-72 sm:w-72" />
      <div className="absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl sm:-left-24 sm:h-80 sm:w-80" />

      <div className="relative mx-auto grid max-w-7xl gap-6 px-3 py-12 sm:gap-10 sm:px-5 md:py-20 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:px-8 lg:py-24">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <AnimatedHeroTitle />
          <motion.p
            className="mt-3 max-w-xl text-sm font-medium text-white/82 sm:mt-5 sm:text-lg md:text-xl"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.42 }}
          >
            Learn • Certify • Get Placed • Go Abroad
          </motion.p>
          <motion.p
            className="mt-2 max-w-xl text-xs font-medium text-accent/90 sm:text-base"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.5 }}
          >
            🌍 US • UK • Australia • New Zealand • Europe
          </motion.p>
          <motion.p
            className="mt-3 max-w-xl text-xs leading-relaxed text-white/70 sm:mt-4 sm:text-base"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.58 }}
          >
            Practical training, real-time projects, interview preparation and career support from
            Kridha Software Solutions Private Limited.
          </motion.p>
          <motion.div
            className="mt-6 flex flex-col gap-2 sm:mt-8 sm:flex-row sm:gap-3"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.68 }}
          >
            <AnimatedCTA />
          </motion.div>
        </motion.div>

        <div className="relative mx-auto w-full max-w-sm sm:max-w-md lg:max-w-lg">
          <div className="absolute inset-0 rounded-3xl bg-accent/25 blur-3xl sm:rounded-[2.2rem]" />
          <motion.div
            className="relative rounded-2xl border border-white/15 bg-white/10 p-4 shadow-glow backdrop-blur sm:rounded-[2rem] sm:p-5"
            initial={reduceMotion ? false : { opacity: 0, y: 22, rotate: -1.5 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            whileHover={reduceMotion ? undefined : { rotate: -1.2, scale: 1.012 }}
            transition={{
              opacity: { duration: 0.6, delay: 0.35 },
              y: { duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] },
              rotate: { duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] },
              scale: { type: "spring", stiffness: 300, damping: 24 },
            }}
          >
            <div className="rounded-xl bg-white p-3 text-primary sm:rounded-[1.5rem] sm:p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm font-extrabold">
                  <Laptop className="h-4 w-4 sm:h-5 sm:w-5" /> Live Project Class
                </div>
                <LiveBadge />
              </div>
              <div className="mt-4 grid gap-3 sm:mt-5 sm:grid-cols-[0.9fr_1.1fr] sm:gap-4">
                <div className="rounded-xl bg-primary p-3 text-center text-white sm:rounded-2xl sm:p-5">
                  <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-accent text-4xl shadow-[0_0_28px_rgba(0,230,118,0.18)] sm:h-24 sm:w-24 sm:text-5xl">
                    🎓
                  </div>
                  <p className="mt-3 text-xs font-bold leading-tight sm:mt-4 sm:text-sm">
                    Student + Laptop Visual
                  </p>
                  <p className="mt-1 text-[0.65rem] text-white/70 sm:text-xs">
                    Mobile-first, fast.
                  </p>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  {FEATURE_ITEMS.map((x, index) => (
                    <FeaturePill key={x} label={x} index={index} />
                  ))}
                  <div className="rounded-lg bg-primary p-3 text-white sm:rounded-2xl sm:p-4">
                    <div className="flex items-center gap-2 text-xs font-bold sm:text-sm">
                      <PlayCircle className="h-3 w-3 flex-shrink-0 text-accent sm:h-4 sm:w-4" />{" "}
                      Demo class available
                    </div>
                    <PriceReveal />
                    <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-accent/20 px-2 py-0.5 text-[0.6rem] font-extrabold text-accent sm:text-[0.65rem]">
                      🎉 Limited Offer
                    </div>
                    <div className="mt-1 text-[0.65rem] text-white/70 sm:text-xs">
                      Limited seats · EMI available
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
