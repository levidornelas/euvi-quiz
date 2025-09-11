import { useEffect, useRef } from "react";

type GamepadActions = "up" | "down" | "select";

export function useGamepad(onInput?: (action: GamepadActions) => void) {
  const lastPressTime = useRef<{ [key: number]: number }>({});
  const DEBOUNCE_MS = 200;

  useEffect(() => {
    let rafId: number;

    const loop = () => {
      const gamepads = navigator.getGamepads?.();
      if (!gamepads) return;

      const now = Date.now();

      for (const gp of gamepads) {
        if (!gp) continue;

        // D-Pad ↑
        if (gp.buttons[12]?.pressed) {
          if (!lastPressTime.current[12] || now - lastPressTime.current[12] > DEBOUNCE_MS) {
            console.log("[D-Pad ↑] Sobe");
            onInput?.("up");
            lastPressTime.current[12] = now;
          }
        }

        // D-Pad ↓
        if (gp.buttons[13]?.pressed) {
          if (!lastPressTime.current[13] || now - lastPressTime.current[13] > DEBOUNCE_MS) {
            console.log("[D-Pad ↓] Desce");
            onInput?.("down");
            lastPressTime.current[13] = now;
          }
        }

        // Botão A / 0
        if (gp.buttons[0]?.pressed) {
          if (!lastPressTime.current[0] || now - lastPressTime.current[0] > DEBOUNCE_MS) {
            console.log("[A] Confirma");
            onInput?.("select");
            lastPressTime.current[0] = now;
          }
        }
      }

      rafId = requestAnimationFrame(loop);
    };

    loop();

    return () => cancelAnimationFrame(rafId);
  }, [onInput]);
}
