import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1] bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-background via-background to-black"></div>
      
      {/* Primary glowing orb - Optimized with radial gradient instead of blur filter */}
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,_rgba(168,85,247,0.15)_0%,_rgba(168,85,247,0)_70%)]"
      />

      {/* Secondary glowing orb */}
      <motion.div
        animate={{
          x: [0, -50, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,_rgba(6,182,212,0.1)_0%,_rgba(6,182,212,0)_70%)]"
      />

      {/* Accent glowing orb */}
      <motion.div
        animate={{
          x: [0, 30, -30, 0],
          y: [0, 30, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-[40%] left-[60%] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,_rgba(236,72,153,0.1)_0%,_rgba(236,72,153,0)_70%)]"
      />
    </div>
  );
}
