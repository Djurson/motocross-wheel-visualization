import { useLoader } from "@react-three/fiber";
import { useMemo, useEffect } from "react";
import { WheelParts } from "./types";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import * as THREE from "three";

type variant = "front" | "rear";
type showing = "both" | "single";

const Wheel = ({ colors, variant, showing }: { colors: { Hub: string; Spokes: string; Rim: string; Nipples: string }; variant: variant; showing: showing }) => {
  const frontGLTF = useLoader(GLTFLoader, "/FrontWheelV2.glb");
  const rearGLTF = useLoader(GLTFLoader, "/RearWheelV2.glb");

  const gltf = variant === "front" ? frontGLTF : rearGLTF;

  const position = useMemo(() => {
    if (showing === "both") {
      return variant === "front" ? [-2.2, 0, 0] : [2.2, 0, 0];
    }
    return [0, 0, 0];
  }, [variant, showing]);

  const parts = useMemo(() => {
    const result: WheelParts = {};

    gltf.scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;

        mesh.receiveShadow = true;
        mesh.castShadow = true;

        const mat = mesh.material as THREE.MeshPhysicalMaterial;
        mat.fog = true;
        mat.roughness = 0.35;
        mat.emissive.set(new THREE.Color(mat.color));
        mat.emissiveIntensity = 0.2;

        if (mesh.name === "Front_Hub") result.FrontHub = mesh;
        if (mesh.name === "Front_Spokes") result.FrontSpokes = mesh;
        if (mesh.name === "Front_Rim") result.FrontRim = mesh;
        if (mesh.name === "Front_Nipples") result.FrontNipples = mesh;
        if (mesh.name === "Rear_Hub") result.RearHub = mesh;
        if (mesh.name === "Rear_Spokes") result.RearSpokes = mesh;
        if (mesh.name === "Rear_Rim") result.RearRim = mesh;
        if (mesh.name === "Rear_Nipples") result.RearNipples = mesh;
      }
    });

    if (showing === "both") {
      gltf.scene.rotation.y = variant === "front" ? Math.PI + -Math.PI / 3 : Math.PI / 3;
    } else {
      gltf.scene.rotation.y = Math.PI / 3;
    }

    return result;
  }, [gltf, variant, showing]);

  useEffect(() => {
    if (!parts) return;

    const colorToMeshMap: Record<string, keyof WheelParts> =
      variant === "front"
        ? {
            Hub: "FrontHub",
            Spokes: "FrontSpokes",
            Rim: "FrontRim",
            Nipples: "FrontNipples",
          }
        : {
            Hub: "RearHub",
            Spokes: "RearSpokes",
            Rim: "RearRim",
            Nipples: "RearNipples",
          };

    for (const key of Object.keys(colors)) {
      const meshKey = colorToMeshMap[key];
      const mesh = parts[meshKey];
      if (mesh) {
        const mat = mesh.material as THREE.MeshPhysicalMaterial;
        mat.color.set(colors[key as keyof typeof colors]);
        mat.emissive.set(colors[key as keyof typeof colors]);
        mat.needsUpdate = true;
      }
    }
  }, [colors, variant, parts]);

  return <primitive object={gltf.scene} position={position} scale={1} />;
};

export { Wheel };
