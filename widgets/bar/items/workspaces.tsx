import { compositor } from "@/options";
import { Workspaces_Niri } from "./workspaces_niri";
import { Workspaces_Hypr } from "./workspaces_hypr";

export function Workspaces() {
   return (
      <box>
         {compositor.get() === "niri" ? (
            <Workspaces_Niri />
         ) : compositor.get() === "hyprland" ? (
            <Workspaces_Hypr />
         ) : (
            <box />
         )}
      </box>
   );
}
