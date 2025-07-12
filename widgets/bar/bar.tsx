import app from "ags/gtk4/app";
import { Astal, Gdk } from "ags/gtk4";
const { name, position, spacing } = options.bar;

import { Clock } from "./items/clock";
import { Launcher } from "./items/launcher";
import { SysBox } from "./items/sysbox";
import { Tray } from "./items/tray";
import { Keyboard_Niri } from "./items/keyboard_niri";
import { Keyboard_Hypr } from "./items/keyboard_hypr";
import { Workspaces_Niri } from "./items/workspaces_niri";
import { Workspaces_Hypr } from "./items/workspaces_hypr";
import { RecordIndicator } from "./items/recordindicator";
import options, { compositor } from "@/options";

function Start() {
   return (
      <box $type="start" spacing={spacing}>
         <Launcher />
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

function Center() {
   return (
      <box $type={"center"} spacing={spacing}>
         <Clock />
      </box>
   );
}

function End() {
   return (
      <box $type="end" spacing={spacing}>
         <RecordIndicator />
         <Tray />
         {compositor.get() === "niri" ? (
            <Keyboard_Niri />
         ) : compositor.get() === "hyprland" ? (
            <Keyboard_Hypr />
         ) : (
            <box />
         )}
         <SysBox />
      </box>
   );
}

export default function Bar(gdkmonitor: Gdk.Monitor) {
   const { BOTTOM, TOP, LEFT, RIGHT } = Astal.WindowAnchor;

   return (
      <window
         visible
         name={name}
         namespace={name}
         class={name}
         gdkmonitor={gdkmonitor}
         exclusivity={Astal.Exclusivity.EXCLUSIVE}
         anchor={position.as(
            (p) => (p === "top" ? TOP : BOTTOM) | LEFT | RIGHT,
         )}
         application={app}
      >
         <centerbox class={"bar-main"} heightRequest={options.bar.height}>
            <Start />
            <Center />
            <End />
         </centerbox>
      </window>
   );
}
