import React, { Suspense, useState } from "react";
import { Canvas, useThree, extend, useFrame } from "react-three-fiber";
import * as THREE from "three";
import Image from "next/image";
import {
  Environment,
  MeshReflectorMaterial,
  OrbitControls,
} from "@react-three/drei";

interface TextInputObjectProps {
  // Props go here (if any)
}

const TextInputObject: React.FC<TextInputObjectProps> = (props) => {
  const [text, setText] = useState("");
  const [object, setObject] = useState<THREE.Object3D | null>(null);

  const generateObject = (input: string) => {
    // Parse the input text to extract the dimensions and colors for the cube
    const dimensions = input.match(/\d+/g)?.map(Number) || [1, 1, 1];
    const colors = input.match(/#[0-9a-f]{6}/gi) || ["#ffffff"];

    // Create a 3D cube with the extracted dimensions and colors
    const newObject = new THREE.Object3D();
    newObject.add(
      new THREE.Mesh(
        new THREE.BoxGeometry(...dimensions),
        new THREE.MeshBasicMaterial({ color: colors[0] })
      )
    );
    setObject(newObject);
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
        className=""
        dpr={[1, 1.5]}
        shadows
        camera={{ position: [-18, 15, 18], fov: 35 }}
        gl={{ alpha: false }}
      >
        <OrbitControls />
        <color attach="background" args={["#343541"]} />
        <ambientLight intensity={0.2} />
        <directionalLight
          castShadow
          intensity={0.3}
          position={[10, 6, 0]}
          shadow-mapSize={[1024, 1024]}
        />
        {object && <primitive object={object} />}
        <Suspense fallback={null}>
          {/* <CameraAnimation /> */}
          <mesh position={[0, -5.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[2000, 2000]} />
            <MeshReflectorMaterial
              blur={[1000, 50]}
              resolution={1024}
              mixBlur={1}
              mixStrength={5}
              depthScale={0.8}
              minDepthThreshold={0.92}
              color="#343541"
              metalness={0.9}
              roughness={1}
              mirror={0}
            />
          </mesh>
          <Environment preset="warehouse" />
        </Suspense>
      </Canvas>
    </>
  );
};

export default TextInputObject;
