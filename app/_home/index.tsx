import { useRef } from "react";
import { useFrame, extend, useThree } from "@react-three/fiber";
import { usePerformanceMonitor } from "@react-three/drei";
import { CONFIG, setGUI } from "./config";
import { useGUI } from "@/utils/useGUI";
import {
   FxTransparentMaterial,
   FxTransparentMaterialProps,
} from "@/utils/fxTransparentMaterial";
import {
   useFluid,
   useFogProjection,
   useNoise,
} from "@/packages/use-shader-fx/src";

extend({ FxTransparentMaterial });

export const Home = () => {
   const updateGUI = useGUI(setGUI);
   const mainShaderRef = useRef<FxTransparentMaterialProps>();

   const size = useThree((state) => state.size);
   const dpr = useThree((state) => state.viewport.dpr);

   const [updateNoise] = useNoise({ size, dpr });

   const [updateFluid, setFluid] = useFluid({
      size,
      dpr,
   });

   const [updateFogProjection] = useFogProjection({ size, dpr });

   usePerformanceMonitor({
      onChange({ factor }) {
         setFluid({
            pressure_iterations: Math.max(2, Math.floor(20 * factor)),
         });
      },
   });

   useFrame((props) => {
      const noise = updateNoise(props, {
         timeStrength: 0.4,
      });

      const fx = updateFluid(props, {
         density_dissipation: CONFIG.fluid.density_dissipation,
         velocity_dissipation: CONFIG.fluid.velocity_dissipation,
         velocity_acceleration: CONFIG.fluid.velocity_acceleration,
         pressure_dissipation: CONFIG.fluid.pressure_dissipation,
         curl_strength: CONFIG.fluid.curl_strength,
         splat_radius: CONFIG.fluid.splat_radius,
         fluid_color: CONFIG.fluid.fluid_color,
      });

      const postFx = updateFogProjection(props, {
         distortionStrength: CONFIG.fogProjection.distortionStrength,
         fogEdge0: CONFIG.fogProjection.fogEdge0,
         fogEdge1: CONFIG.fogProjection.fogEdge1,
         fogColor: CONFIG.fogProjection.fogColor,
         texture: fx,
         noiseMap: noise,
      });

      const main = mainShaderRef.current;
      if (main) {
         main.u_fx = postFx;
      }
      updateGUI();
   });

   return (
      <mesh>
         <planeGeometry args={[2, 2]} />
         <fxTransparentMaterial
            key={FxTransparentMaterial.key}
            ref={mainShaderRef}
         />
      </mesh>
   );
};

/*===============================================
the simplest demo
===============================================*/

// import * as THREE from "three";
// import { useRef } from "react";
// import { useFrame, useThree } from "@react-three/fiber";
// import { useFluid } from "@hmng8/use-shader-fx";

// export const Home = () => {
//    const ref = useRef<THREE.ShaderMaterial>(null);
//    const size = useThree((state) => state.size);
//    const dpr = useThree((state) => state.viewport.dpr);
//    const [updateFluid] = useFluid({ size, dpr });
//    useFrame((props) => {
//       ref.current!.uniforms.u_fx.value = updateFluid(props);
//    });

//    return (
//       <mesh>
//          <planeGeometry args={[2, 2]} />
//          <shaderMaterial
//             ref={ref}
//             vertexShader={`
// 					varying vec2 vUv;
// 						void main() {
// 							vUv = uv;
// 							gl_Position = vec4(position, 1.0);
// 						}
// 						`}
//             fragmentShader={`
// 						precision highp float;
// 						varying vec2 vUv;
// 						uniform sampler2D u_fx;

// 						void main() {
// 							vec2 uv = vUv;
// 							gl_FragColor = texture2D(u_fx, uv);
// 						}
// 					`}
//             uniforms={{
//                u_fx: { value: null },
//             }}
//          />
//       </mesh>
//    );
// };