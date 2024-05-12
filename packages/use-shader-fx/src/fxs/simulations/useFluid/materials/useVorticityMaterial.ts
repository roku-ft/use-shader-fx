import * as THREE from "three";
import { useMemo } from "react";
import vertexShader from "../shaders/main.vert";
import fragmentShader from "../shaders/vorticity.frag";
import { MaterialProps } from "../../../types";
import { MATERIAL_BASIC_PARAMS } from "../../../../libs/constants";
import { DELTA_TIME } from "..";
import { setOnBeforeCompile } from "../../../../utils/setOnBeforeCompile";

export class VorticityMaterial extends THREE.ShaderMaterial {
   uniforms!: {
      uVelocity: { value: THREE.Texture };
      uCurl: { value: THREE.Texture };
      curl: { value: number };
      dt: { value: number };
      texelSize: { value: THREE.Vector2 };
   };
}

export const useVorticityMaterial = ({
   onBeforeCompile,
   uniforms,
}: MaterialProps) => {
   const vorticityMaterial = useMemo(() => {
      const mat = new THREE.ShaderMaterial({
         uniforms: {
            uVelocity: { value: null },
            uCurl: { value: null },
            curl: { value: 0 },
            dt: { value: DELTA_TIME },
            texelSize: { value: new THREE.Vector2() },
            ...uniforms,
         },
         vertexShader: vertexShader,
         fragmentShader: fragmentShader,
         ...MATERIAL_BASIC_PARAMS,
      });

      mat.onBeforeCompile = setOnBeforeCompile(onBeforeCompile);

      return mat;
   }, [onBeforeCompile, uniforms]);

   return vorticityMaterial as VorticityMaterial;
};