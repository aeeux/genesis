import React, { Suspense, useState } from "react";
import { Canvas, useThree, extend, useFrame } from "react-three-fiber";
import * as THREE from "three";
import Image from "next/image";
import {
  AccumulativeShadows,
  Backdrop,
  BakeShadows,
  Cloud,
  ContactShadows,
  Environment,
  Float,
  Lightformer,
  MeshReflectorMaterial,
  OrbitControls,
  RandomizedLight,
  Shadow,
  Sky,
  Stage,
  Stars,
} from "@react-three/drei";
import Porsche from "../components/Porsche";
import { LayerMaterial, Color, Depth } from "lamina";

interface TextInputObjectProps {}

interface TextInputObjectState {}

const DIMENSIONS_REGEX = /\d+/g;
const COLORS_REGEX = /#[0-9a-f]{6}/gi;
const OBJECT_TYPE_REGEX = /box|sphere|torus/i;

const TextInputObject: React.FC<TextInputObjectProps> = (props) => {
  const [text, setText] = useState("");
  const [object, setObject] = useState<THREE.Object3D | null>(null);

  const generateObject = (input: string): void => {
    // Parse the input text to extract the dimensions and colors for the cube
    const dimensions = input.match(DIMENSIONS_REGEX)?.map(Number) || [1, 1, 1];
    const colors = input.match(COLORS_REGEX) || ["#ffffff"];
    const objectType = input.match(OBJECT_TYPE_REGEX)?.[0] || "";

    let objectGeometry = new THREE.Object3D();

    // Create the object using the appropriate three.js geometry and material
    switch (typeof objectType === "string" ? objectType : "") {
      case "box":
        objectGeometry = new THREE.Mesh(
          new THREE.BoxGeometry(...dimensions),
          new THREE.MeshBasicMaterial({ color: colors[0] })
        );
        break;
      case "sphere":
        objectGeometry = new THREE.Mesh(
          new THREE.SphereGeometry(dimensions[0], 32, 32),
          new THREE.MeshBasicMaterial({ color: colors[0] })
        );
        break;
      case "torus":
        objectGeometry = new THREE.Mesh(
          new THREE.TorusGeometry(dimensions[0], dimensions[1], 32, 32),
          new THREE.MeshBasicMaterial({ color: colors[0] })
        );
        break;
      case "porsche":
        objectGeometry = new THREE.Mesh(
          new THREE.TorusGeometry(dimensions[0], dimensions[1], 32, 32),
          new THREE.MeshBasicMaterial({ color: colors[0] })
        );
        break;
      default:
        objectGeometry = new THREE.Object3D();
        break;
    }
    //#035efc color for testing
    // Create a 3D cube with the extracted dimensions and colors
    objectGeometry.add(
      new THREE.Mesh(
        new THREE.BufferGeometry(),
        new THREE.MeshBasicMaterial({ color: colors[0] })
      )
    );
    setObject(objectGeometry);
  };

  return (
    <>
      <div className="absolute text-center z-10 bottom-6 justify-center right-0 left-0">
        <div className="flex justify-center">
          <div className="flex flex-col py-2 pl-3 w-1/2  md:py-3 md:pl-4 relative border border-gray-900/50 text-white bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]">
            <input
              type="text"
              value={text}
              className="m-0 w-full resize-none border-0 p-0 pr-7 border-transparent bg-transparent outline-none"
              onChange={(e) => setText(e.target.value)}
            />
            <button
              className="absolute p-1 rounded-md text-gray-500 bottom-1.5 right-1 md:bottom-2.5 md:right-2 hover:bg-gray-100 dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent"
              onClick={() => generateObject(text)}
            >
              <Image
                className="h-4 w-4 rotate-90"
                alt=""
                src="/arrow.svg"
                height={40}
                width={40}
              />
            </button>
          </div>
        </div>
        <p className="mt-3 text-white/40 text-sm">
          GenesisNLO Dec 26 Version. Free Research Preview. Our goal is to make
          AI systems more natural and safe to interact with. Your feedback will
          help us improve.
        </p>
      </div>
      <Canvas
        dpr={[1, 1.5]}
        shadows
        camera={{ position: [-10, 0, 15], fov: 30 }}
        gl={{ alpha: false }}
      >
        <OrbitControls makeDefault />
        <Porsche
          scale={1.6}
          position={[-0.5, -0.18, 0]}
          rotation={[0, Math.PI / 5, 0]}
        />
        {object && <primitive object={object} />}
        <spotLight
          position={[0, 15, 0]}
          angle={0.3}
          penumbra={1}
          castShadow
          intensity={2}
          shadow-bias={-0.0001}
        />
        <ambientLight intensity={0.2} />
        <ContactShadows
          resolution={1024}
          frames={1}
          position={[0, -1.16, 0]}
          scale={10}
          blur={3}
          opacity={1}
          far={10}
        />
        {/* Renders contents "live" into a HDRI environment (scene.environment). */}
        <Environment frames={Infinity} resolution={256}>
          {/* Ceiling */}
          <Lightformer
            intensity={0.75}
            rotation-x={Math.PI / 2}
            position={[0, 5, -9]}
            scale={[10, 10, 1]}
          />
          {/* Sides */}
          <Lightformer
            intensity={4}
            rotation-y={Math.PI / 2}
            position={[-5, 1, -1]}
            scale={[20, 0.1, 1]}
          />
          <Lightformer
            rotation-y={Math.PI / 2}
            position={[-5, -1, -1]}
            scale={[20, 0.5, 1]}
          />
          <Lightformer
            rotation-y={-Math.PI / 2}
            position={[10, 1, 0]}
            scale={[20, 1, 1]}
          />
          {/* Accent (red) */}
          <Float speed={5} floatIntensity={2} rotationIntensity={2}>
            <Lightformer
              form="ring"
              color="red"
              intensity={1}
              scale={10}
              position={[-15, 4, -18]}
              target={[0, 0, 0]}
            />
          </Float>
          {/* Background */}
          <mesh scale={100}>
            <sphereGeometry args={[1, 64, 64]} />
            <LayerMaterial side={THREE.BackSide}>
              <Color color="#444" alpha={1} mode="normal" />
              <Depth
                colorA="blue"
                colorB="black"
                alpha={0.5}
                mode="normal"
                near={0}
                far={300}
                origin={[100, 100, 100]}
              />
            </LayerMaterial>
          </mesh>
        </Environment>
        <BakeShadows />
      </Canvas>
    </>
  );
};

export default TextInputObject;
