import React, { useState } from "react";
import { Canvas, useThree, extend, useFrame } from "react-three-fiber";
import * as THREE from "three";

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
      <div>
        <input
          type="text"
          value={text}
          className="bg-red-500"
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={() => generateObject(text)}>Generate Object</button>
      </div>
      <Canvas>{object && <primitive object={object} />}</Canvas>
    </>
  );
};

export default TextInputObject;
