"use client";

import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Wheel } from "./wheel";

type show = "Both" | "Front" | "Rear";

const ThreeScene = () => {
  const [colors, setColors] = useState({
    Hub: "#ff0000",
    Spokes: "#ffffff",
    Rim: "#000000",
    Nipples: "#ff0120",
  });

  const [showing, setShowing] = useState<show>("Both");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const newColors: Partial<typeof colors> = {};

    // Map from URL param to state key
    const paramMap: Record<string, keyof typeof colors> = {
      rim_color: "Rim",
      hub_color: "Hub",
      spokes_color: "Spokes",
      nipples_color: "Nipples",
    };

    const wheelsParam = params.get("wheels");
    const validShows: show[] = ["Both", "Front", "Rear"];
    if (wheelsParam && validShows.includes(wheelsParam as show)) {
      setShowing(wheelsParam as show);
    }

    for (const [paramKey, stateKey] of Object.entries(paramMap)) {
      const paramValue = params.get(paramKey);

      if (paramValue) {
        newColors[stateKey] = "#" + paramValue.replace(/^#/, "");
      }
    }

    if (Object.keys(newColors).length > 0) {
      setColors((prev) => ({ ...prev, ...newColors }));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas camera={{ position: [0, 0, 8] }} dpr={[1, 2]} shadows>
        {/* <fog attach="fog" args={["#595959", 5, 20]} /> */}
        <color attach="background" args={["#fff"]} />
        <directionalLight intensity={2} position={[0, 0, 5]} />
        <ambientLight intensity={10} position={[0, 0, 2]} />
        <Suspense fallback={null}>
          {(showing === "Both" || showing === "Front") && <Wheel colors={colors} variant="front" showing={showing === "Both" ? "both" : "single"} />}
          {(showing === "Both" || showing === "Rear") && <Wheel colors={colors} variant="rear" showing={showing === "Both" ? "both" : "single"} />}
        </Suspense>
      </Canvas>
    </div>
  );
};

export { ThreeScene };
