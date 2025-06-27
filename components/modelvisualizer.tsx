"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { FrontWheel } from "./frontwheel";
import { RearWheel } from "./rearwheel";

const ThreeScene = () => {
  const [colors, setColors] = useState({
    Hub: "#ff0000",
    Spokes: "#ffffff",
    Rim: "#3b3b3b",
    Nipples: "#ff0120",
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const newColors: Partial<typeof colors> = {};

    for (const key of Object.keys(colors)) {
      const param = params.get(key); // förväntar: ?Hub=ff0000&Spokes=00ff00 ...
      if (param) {
        newColors[key as keyof typeof colors] = "#" + param.replace(/^#/, "");
      }
    }

    if (Object.keys(newColors).length > 0) {
      setColors((prev) => ({ ...prev, ...newColors }));
    }
  }, []);

  return (
    <div>
      <div style={{ position: "absolute", top: 10, left: 10, zIndex: 10 }}>
        <label>
          Navfärg:
          <input type="color" value={colors.Hub} onChange={(e) => setColors({ ...colors, Hub: e.target.value })} />
        </label>
        <label>
          Ekrar:
          <input type="color" value={colors.Spokes} onChange={(e) => setColors({ ...colors, Spokes: e.target.value })} />
        </label>
        <label>
          Fälgbana:
          <input type="color" value={colors.Rim} onChange={(e) => setColors({ ...colors, Rim: e.target.value })} />
        </label>
        <label>
          Nipplar:
          <input type="color" value={colors.Nipples} onChange={(e) => setColors({ ...colors, Nipples: e.target.value })} />
        </label>
      </div>
      <div style={{ width: "100vw", height: "100vh" }}>
        <Canvas camera={{ position: [0, 0, 8], fov: 60 }} dpr={[1, 2]}>
          <color attach="background" args={["#fff"]} />
          <directionalLight intensity={1} position={[2, 0, 5]} />
          <ambientLight intensity={1} position={[0, 0, 2]} />
          <Suspense fallback={null}>
            <FrontWheel colors={colors} />
            <RearWheel colors={colors} />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
};

export { ThreeScene };
