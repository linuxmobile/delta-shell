import Astal from "gi://Astal?version=4.0";
import Gdk from "gi://Gdk";
import Gtk from "gi://Gtk";
import app from "ags/gtk4/app";
import Graphene from "gi://Graphene?version=1.0";
import { NetworkPage } from "./pages/network";
import { MainPage } from "./pages/main";
import { BluetoothPage } from "./pages/bluetooth";
import { PowerModesPage } from "./pages/powermodes";
import { onCleanup } from "ags";
import { hide_all_windows } from "@/windows";
import options from "@/options";
import Adw from "gi://Adw?version=1";
const { name, page, width, margin } = options.control;

function Control() {
   return (
      <stack
         class={"control-main"}
         transitionDuration={200}
         widthRequest={width}
         transitionType={Gtk.StackTransitionType.SLIDE_LEFT_RIGHT}
         visibleChildName={page}
      >
         <NetworkPage />
         <MainPage />
         <BluetoothPage />
         <PowerModesPage />
      </stack>
   );
}

export default function (gdkmonitor: Gdk.Monitor) {
   const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor;
   let win: Astal.Window;
   let contentbox: Adw.Clamp;

   function onKey(
      _e: Gtk.EventControllerKey,
      keyval: number,
      _: number,
      mod: number,
   ) {
      if (keyval === Gdk.KEY_Escape) {
         if (page.get() == "main") {
            hide_all_windows();
         } else {
            page.set("main");
         }
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
         namespace={name}
         gdkmonitor={gdkmonitor}
         exclusivity={Astal.Exclusivity.NORMAL}
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
         <Adw.Clamp
            $={(self) => (contentbox = self)}
            halign={Gtk.Align.END}
            focusable
            maximum_size={width}
            margin_end={margin}
            marginBottom={margin}
            marginTop={margin}
         >
            <Control />
         </Adw.Clamp>
      </window>
   );
}
