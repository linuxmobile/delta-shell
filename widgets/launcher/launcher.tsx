import Astal from "gi://Astal?version=4.0";
import Gdk from "gi://Gdk";
import Gtk from "gi://Gtk";
import app from "ags/gtk4/app";
import Graphene from "gi://Graphene?version=1.0";
import { AppLauncher } from "./pages/applauncher";
import { Clipboard } from "./pages/clipboard";
import { hide_all_windows } from "../../windows";
import Adw from "gi://Adw?version=1";
import options from "@/options";

const { name, page, width, margin } = options.launcher;

const Launcher = () => (
   <stack
      class="launcher-main"
      widthRequest={width}
      transitionDuration={options.transition}
      transitionType={Gtk.StackTransitionType.SLIDE_LEFT_RIGHT}
      visibleChildName={page.as((p) => p)}
   >
      <AppLauncher />
      <Clipboard />
   </stack>
);

export default (gdkmonitor: Gdk.Monitor) => {
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
         namespace={name}
         gdkmonitor={gdkmonitor}
         exclusivity={Astal.Exclusivity.NORMAL}
         anchor={TOP | BOTTOM | LEFT | RIGHT}
         keymode={Astal.Keymode.ON_DEMAND}
         layer={Astal.Layer.TOP}
         application={app}
         visible={false}
      >
         <Gtk.EventControllerKey onKeyPressed={onKey} />
         <Gtk.GestureClick onPressed={onClick} />
         <box
            $={(ref) => (contentbox = ref)}
            halign={Gtk.Align.START}
            orientation={Gtk.Orientation.VERTICAL}
            marginStart={margin}
            marginBottom={margin}
            marginTop={margin}
         >
            <Launcher />
         </box>
      </window>
   );
};
