import { useLoader } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { WheelParts } from "./types";
import { TextureLoader } from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import * as THREE from "three";

const FrontWheel = ({ colors }: { colors: { Hub: string; Spokes: string; Rim: string; Nipples: string } }) => {
  const gltf = useLoader(GLTFLoader, "/FrontWheel.glb");
  const specularMap = useLoader(TextureLoader, "/wheel_spec.png");
  const parts = useRef<WheelParts>({});

  useEffect(() => {
    gltf.scene.rotation.y = -Math.PI / 3;
    gltf.scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.MeshPhongMaterial;
        if ("specularMap" in mat) {
          mat.specularMap = specularMap;
          mat.needsUpdate = true;
        }

        if (mesh.name === "front_wheel_hub") parts.current.FrontHub = mesh;
        if (mesh.name === "front_wheel_spokes") parts.current.FrontSpokes = mesh;
        if (mesh.name === "front_wheel_rim") parts.current.FrontRim = mesh;
        if (mesh.name === "front_wheel_nipples") parts.current.FrontNipples = mesh;
      }
    });
  }, [gltf, specularMap]);

  // 2. Applicera färger
  useEffect(() => {
    const colorToMeshMap: Record<string, keyof WheelParts> = {
      Hub: "FrontHub",
      Spokes: "FrontSpokes",
      Rim: "FrontRim",
      Nipples: "FrontNipples",
    };

    for (const key of Object.keys(colors)) {
      const meshKey = colorToMeshMap[key];
      const mesh = parts.current[meshKey];
      if (mesh) {
        const mat = mesh.material as THREE.MeshPhongMaterial;
        mat.color = new THREE.Color(colors[key as keyof typeof colors]);
        mat.needsUpdate = true;
      }
    }
  }, [colors]);

  return <primitive object={gltf.scene} position={[-2.2, 0, 0]} scale={3} />;
};

export { FrontWheel };
