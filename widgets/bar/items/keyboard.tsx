import { compositor } from "@/options";
import { Keyboard_Niri } from "./keyboard_niri";
import { Keyboard_Hypr } from "./keyboard_hypr";

export function Keyboard() {
   return (
      <box>
         {compositor.get() === "niri" ? (
            <Keyboard_Niri />
         ) : compositor.get() === "hyprland" ? (
            <Keyboard_Hypr />
         ) : (
            <box />
         )}
      </box>
   );
}
