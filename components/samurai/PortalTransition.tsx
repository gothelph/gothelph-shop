"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTransitionStore } from "./transitionStore";

export default function PortalTransition() {
  const { isAnimating } = useTransitionStore();

  return (
    <AnimatePresence>
      {isAnimating && (
        <motion.div
          className="portal"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 2, opacity: 1 }}
          exit={{ scale: 3, opacity: 0 }}
          transition={{ duration: 0.7 }}
        />
      )}

      <style jsx>{`
        .portal {
          position: fixed;
          inset: 0;
          background: radial-gradient(
            circle,
            rgba(255, 0, 80, 0.6),
            transparent 60%
          );
          z-index: 9999;
          filter: blur(10px);
        }
      `}</style>
    </AnimatePresence>
  );
}
