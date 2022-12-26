import React, { useMemo, useRef } from "react";
import {
  Environment,
  Lightformer,
  Float,
  useGLTF,
  BakeShadows,
  ContactShadows,
  OrbitControls,
} from "@react-three/drei";
import { Canvas, applyProps, useFrame } from "@react-three/fiber";

function Porsche(props) {
  const { scene, nodes, materials } = useGLTF("/911-transformed.glb");
  useMemo(() => {
    Object.values(nodes).forEach(
      (node) => node.isMesh && (node.receiveShadow = node.castShadow = true)
    );
    applyProps(materials.rubber, {
      color: "#222",
      roughness: 0.6,
      roughnessMap: null,
      normalScale: [4, 4],
    });
    applyProps(materials.window, {
      color: "black",
      roughness: 0,
      clearcoat: 0.1,
    });
    applyProps(materials.coat, {
      envMapIntensity: 4,
      roughness: 0.5,
      metalness: 1,
    });
    applyProps(materials.paint, {
      roughness: 0.5,
      metalness: 0.8,
      color: "#555",
      envMapIntensity: 2,
    });
  }, [nodes, materials]);
  return <primitive object={scene} {...props} />;
}

export default Porsche;
