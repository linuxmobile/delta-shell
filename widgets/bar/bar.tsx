import app from "ags/gtk4/app";
import { Astal, Gdk } from "ags/gtk4";
import { Workspaces } from "./items/workspaces";
import { Clock } from "./items/clock";
import { Launcher } from "./items/launcher";
import { SysBox } from "./items/sysbox";
import { Tray } from "./items/tray";
import { RecordIndicator } from "./items/recordindicator";
import { Keyboard } from "./items/keyboard";
import options, { compositor } from "@/options";
const { name, position, spacing } = options.bar;

function Start() {
   return (
      <box $type="start" spacing={spacing}>
         <Launcher />
         <Workspaces />
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
         <Keyboard />
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
