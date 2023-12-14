"use client";

import { useState } from "react";
import { ShaderFx } from "../ShaderFx";
import { DomSyncer } from "./DomSyncer";

export default function Page() {
   const [domSwitch, setDomSwitch] = useState(0);
   return (
      <>
         <div
            style={{
               position: "fixed",
               top: 0,
               width: "100%",
               height: "100%",
            }}>
            <ShaderFx>
               <DomSyncer state={domSwitch} />
            </ShaderFx>
         </div>
         <button
            onClick={() => {
               setDomSwitch((prev) => (prev === 0 ? 1 : 0));
            }}
            style={{
               width: "200px",
               height: "200px",
               backgroundColor: "red",
               position: "fixed",
               bottom: 0,
               right: 0,
               zIndex: 1000,
               cursor: "pointer",
            }}>
            stateの切り替え
         </button>
         <div
            style={{
               display: "flex",
               flexWrap: "wrap",
               justifyContent: "center",
               gap: "40px",
               padding: "16px",
               pointerEvents: "none",
            }}>
            {domSwitch === 0 ? (
               <>
                  {[...Array(4)].map((_, i) => (
                     <div
                        className="item"
                        key={i}
                        style={{
                           width: "calc(50% - 40px)",
                           height: "80vh",
                           zIndex: 100,
                           borderRadius: `${i * 50}px`,
                        }}></div>
                  ))}
               </>
            ) : (
               <>
                  {[...Array(2)].map((_, i) => (
                     <div
                        className="item2"
                        key={i}
                        style={{
                           width: "100%",
                           height: "80vh",
                           zIndex: 100,
                        }}></div>
                  ))}
               </>
            )}
         </div>
      </>
   );
}