"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTransitionStore } from "./transitionStore";

export default function KatanaTransition() {
  const isAnimating = useTransitionStore((s) => s.isAnimating);

  return (
    <AnimatePresence>
      {isAnimating && (
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          exit={{ scaleY: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            position: "fixed",
            inset: 0,
            background: "black",
            transformOrigin: "center",
            zIndex: 99999,
          }}
        />
      )}
    </AnimatePresence>
  );
}
