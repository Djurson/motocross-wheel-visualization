"use client";

import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Wheel } from "./wheel";

const ThreeScene = () => {
  const [colors, setColors] = useState({
    Hub: "#ff0000",
    Spokes: "#ffffff",
    Rim: "#000000",
    Nipples: "#ff0120",
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const newColors: Partial<typeof colors> = {};

    for (const key of Object.keys(colors)) {
      const param = params.get(key);
      if (param) {
        newColors[key as keyof typeof colors] = "#" + param.replace(/^#/, "");
      }
    }

    if (Object.keys(newColors).length > 0) {
      setColors((prev) => ({ ...prev, ...newColors }));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas camera={{ position: [0, 0, 8] }} dpr={[1, 2]}>
        <color attach="background" args={["#fff"]} />
        <directionalLight intensity={1} position={[2, 0, 5]} />
        <ambientLight intensity={2.5} position={[0, 0, 2]} />
        <Suspense fallback={null}>
          <Wheel colors={colors} variant="front" />
          <Wheel colors={colors} variant="rear" />
        </Suspense>
      </Canvas>
    </div>
  );
};

export { ThreeScene };
