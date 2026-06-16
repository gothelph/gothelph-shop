"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";

export function SuccessModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsVisible(true);
    }
  }, [open]);

  // закрытие с анимацией
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 200); // время анимации
  };

  if (!open) return null;

  return (
    <div
      onClick={handleClose}
      style={{
        position: "fixed",
        inset: 0,
        background: isVisible ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        transition: "background 0.2s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          padding: "24px",
          borderRadius: "12px",
          minWidth: "320px",
          textAlign: "center",

          transform: isVisible ? "scale(1)" : "scale(0.9)",
          opacity: isVisible ? 1 : 0,

          transition: "all 0.2s ease",
        }}
      >
        <h2>Спасибо за заказ 🎉</h2>
        <p>Мы скоро с вами свяжемся</p>

        <div style={{ marginTop: "16px" }}>
          <Button
            onClick={() => {
              handleClose();
              setTimeout(() => {
                window.location.href = "/";
              }, 200);
            }}
          >
            На главную
          </Button>
        </div>
      </div>
    </div>
  );
}
