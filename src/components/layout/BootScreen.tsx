"use client";

import { useEffect, useState } from "react";
import { Cpu } from "lucide-react";

/** Short decorative loading screen shown on first paint. Purely visual, hidden from assistive tech. */
export function BootScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 650);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="boot-screen" aria-hidden="true">
      <div className="boot-mark"><Cpu size={30} /></div>
      <div className="boot-title">SYSTEM INITIALIZATION</div>
      <div className="boot-track"><span /></div>
      <div className="boot-meta">LOADING ENGINEERING ENVIRONMENT <span>READY</span></div>
    </div>
  );
}
