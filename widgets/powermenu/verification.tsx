import Astal from "gi://Astal?version=4.0";
import Gdk from "gi://Gdk";
import Gtk from "gi://Gtk";
import app from "ags/gtk4/app";
import Graphene from "gi://Graphene?version=1.0";
import Powermenu from "@/utils/powermenu";
import { exec } from "ags/process";
import { createBinding } from "ags";
import { hide_all_windows } from "@/windows";
import options from "@/options";
const { name } = options.verification;
const powermenu = Powermenu.get_default();

function Verification() {
   return (
      <box class={"main"} orientation={Gtk.Orientation.VERTICAL} spacing={20}>
         <label label={createBinding(powermenu, "title")} class={"title"} />
         <label label={"Are you sure?"} class={"label"} />
         <box homogeneous={true} spacing={options.theme.spacing}>
            <button
               label={"No"}
               focusOnClick={false}
               onClicked={() => hide_all_windows()}
            />
            <button
               label={"Yes"}
               focusOnClick={false}
               onClicked={() => {
                  exec(powermenu.cmd);
                  hide_all_windows();
               }}
            />
         </box>
      </box>
   );
}

export default function (gdkmonitor: Gdk.Monitor) {
   const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor;
   let win: Astal.Window;
   let contentbox: Gtk.Box;

   function onKey(
      _e: Gtk.EventControllerKey,
      keyval: number,
      _: number,
      mod: number,
   ) {
      if (keyval === Gdk.KEY_Escape) {
         hide_all_windows();
      }
   }

   function onClick(_e: Gtk.GestureClick, _: number, x: number, y: number) {
      const [, rect] = contentbox.compute_bounds(win);
      const position = new Graphene.Point({ x, y });

      if (!rect.contains_point(position)) {
         hide_all_windows();
      }
   }

   return (
      <window
         $={(ref) => (win = ref)}
         class={name}
         name={name}
         gdkmonitor={gdkmonitor}
         exclusivity={Astal.Exclusivity.IGNORE}
         anchor={TOP | BOTTOM | LEFT | RIGHT}
         keymode={Astal.Keymode.ON_DEMAND}
         layer={Astal.Layer.TOP}
         application={app}
         visible={false}
         onNotifyVisible={({ visible }) => {
            if (visible) contentbox.grab_focus();
         }}
      >
         <Gtk.EventControllerKey onKeyPressed={onKey} />
         <Gtk.GestureClick onPressed={onClick} />
         <box
            $={(ref) => (contentbox = ref)}
            focusable
            halign={Gtk.Align.CENTER}
            valign={Gtk.Align.CENTER}
            orientation={Gtk.Orientation.VERTICAL}
         >
            <Verification />
         </box>
      </window>
   );
}
