"use client";

import { useEffect, useRef } from "react";

type Actions = {
  confirm: () => void;     // A
  back?: () => void;       // B
  next?: () => void;       // →
  prev?: () => void;       // ←
  moveUp?: () => void;     // ↑
  moveDown?: () => void;   // ↓
};

export function useGamepad(actions: Actions) {
  const raf = useRef<number | null>(null);
  const prev = useRef<boolean[]>([]);

  const stop = () => {
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = null;
  };

  // dispara apenas na transição "solto → pressionado"
  const edge = (btn?: GamepadButton, i?: number) => {
    if (!btn || i === undefined) return false;
    const was = prev.current[i] ?? false;
    const now = !!btn.pressed;
    prev.current[i] = now;
    return !was && now;
  };

  const tick = () => {
    const gp = (navigator.getGamepads?.() || [])[0];
    if (gp) {
      // Mapeamento X-Input comum (iPega PG-9076)
      if (edge(gp.buttons[0], 0)) actions.confirm();  // A
      if (edge(gp.buttons[1], 1)) actions.back?.();   // B
      if (edge(gp.buttons[12], 12)) actions.moveUp?.();
      if (edge(gp.buttons[13], 13)) actions.moveDown?.();
      if (edge(gp.buttons[14], 14)) actions.prev?.(); // ←
      if (edge(gp.buttons[15], 15)) actions.next?.(); // →
    }
    raf.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    const onConnect = () => { if (!raf.current) tick(); };
    const onDisconnect = stop;

    window.addEventListener("gamepadconnected", onConnect);
    window.addEventListener("gamepaddisconnected", onDisconnect);

    // Alguns browsers só “acordam” depois de um clique
    const kick = () => { if (!raf.current) tick(); };
    window.addEventListener("click", kick, { once: true });

    return () => {
      stop();
      window.removeEventListener("gamepadconnected", onConnect);
      window.removeEventListener("gamepaddisconnected", onDisconnect);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
