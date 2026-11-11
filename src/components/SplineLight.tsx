"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import type { Application } from "@splinetool/runtime";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => null,
});

const SCENE =
  "https://prod.spline.design/kdT2qufq2j01DgCS/scene.splinecode";

/** Only hide the desk / screen planes — leave the lamp hierarchy alone. */
const HIDE = /^(rectangle|rectangle 2)$/i;

export default function SplineLight() {
  const [ready, setReady] = useState(false);

  const onLoad = useCallback((app: Application) => {
    try {
      app.setBackgroundColor("#0f6f6c");
    } catch {
      /* ignore */
    }

    try {
      const report: { name: string; visible: boolean }[] = [];
      for (const obj of app.getAllObjects()) {
        const name = (obj.name || "").trim();
        if (HIDE.test(name)) obj.hide();
        report.push({ name, visible: obj.visible });
      }
      for (const name of [
        "lamp",
        "lightbulb",
        "Spot Light",
        "Group 3",
        "Group 2",
        "Group",
        "Boolean",
        "Ellipse",
        "Ellipse 2",
        "Ellipse 3",
      ]) {
        app.findObjectByName(name)?.show();
      }
      if (typeof window !== "undefined") {
        (window as unknown as { __splineReport?: unknown }).__splineReport =
          report;
        (window as unknown as { __splineApp?: Application }).__splineApp = app;
      }
    } catch {
      /* ignore */
    }

    setReady(true);
  }, []);

  return (
    <div
      className="spline-light"
      style={{ opacity: ready ? 1 : 0 }}
      aria-hidden
    >
      <Spline scene={SCENE} onLoad={onLoad} htmlContentMode="none" />
      <div className="spline-light__badge-mask" />
    </div>
  );
}
