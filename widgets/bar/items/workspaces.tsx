import { compositor } from "@/options";
import { Workspaces_Niri } from "./workspaces_niri";
import { Workspaces_Hypr } from "./workspaces_hypr";
import { With } from "ags";

export function Workspaces() {
   return (
      <box>
         <With value={compositor}>
            {(comp) => {
               if (comp === "niri") return <Workspaces_Niri />;
               if (comp === "hyprland") return <Workspaces_Hypr />;
               return <box />;
            }}
         </With>
      </box>
   );
}
