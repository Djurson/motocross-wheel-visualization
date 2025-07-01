import { useLoader } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { WheelParts } from "./types";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import * as THREE from "three";

type variant = "front" | "rear";
type showing = "both" | "single";

const Wheel = ({ colors, variant, showing }: { colors: { Hub: string; Spokes: string; Rim: string; Nipples: string }; variant: variant; showing: showing }) => {
  const frontGLTF = useLoader(GLTFLoader, "/FrontWheelV2.glb");
  const rearGLTF = useLoader(GLTFLoader, "/RearWheelV2.glb");

  // const specularMap = useLoader(TextureLoader, "/wheel_spec.png");

  const gltf = variant === "front" ? frontGLTF : rearGLTF;
  let pos: number[];
  if (showing === "both") {
    pos = variant === "front" ? [-2.2, 0, 0] : [2.2, 0, 0];
  } else {
    pos = [0, 0, 0];
  }
  const parts = useRef<WheelParts>({});

  useEffect(() => {
    if (showing === "both") {
      gltf.scene.rotation.y = variant === "front" ? Math.PI + -Math.PI / 3 : Math.PI / 3;
    } else {
      gltf.scene.rotation.y = Math.PI / 3;
    }

    gltf.scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;

        mesh.receiveShadow = true;
        mesh.castShadow = true;

        const mat = mesh.material as THREE.MeshPhysicalMaterial;
        mat.roughness = 0.35;
        mat.emissive.add(new THREE.Color(mat.color));
        mat.emissiveIntensity = 0.15;

        if (mesh.name === "front_wheel_hub") parts.current.FrontHub = mesh;
        if (mesh.name === "front_wheel_spokes") parts.current.FrontSpokes = mesh;
        if (mesh.name === "front_wheel_rim") parts.current.FrontRim = mesh;
        if (mesh.name === "front_wheel_nipples") parts.current.FrontNipples = mesh;
        if (mesh.name === "rear_wheel_hub") parts.current.RearHub = mesh;
        if (mesh.name === "rear_wheel_spokes") parts.current.RearSpokes = mesh;
        if (mesh.name === "rear_wheel_rim") parts.current.RearRim = mesh;
        if (mesh.name === "rear_wheel_spokes_nipples") parts.current.RearNipples = mesh;
      }
    });
  }, [gltf, variant]);

  useEffect(() => {
    let colorToMeshMap: Record<string, keyof WheelParts> = {
      Hub: "RearHub",
      Spokes: "RearSpokes",
      Rim: "RearRim",
      Nipples: "RearNipples",
    };

    if (variant === "front") {
      colorToMeshMap = {
        Hub: "FrontHub",
        Spokes: "FrontSpokes",
        Rim: "FrontRim",
        Nipples: "FrontNipples",
      };
    }

    for (const key of Object.keys(colors)) {
      const meshKey = colorToMeshMap[key];
      const mesh = parts.current[meshKey];
      if (mesh) {
        const mat = mesh.material as THREE.MeshPhysicalMaterial;
        mat.color = new THREE.Color(colors[key as keyof typeof colors]);
        mat.needsUpdate = true;
      }
    }
  }, [colors, variant]);

  return <primitive object={gltf.scene} position={pos} scale={1} />;
};

export { Wheel };
