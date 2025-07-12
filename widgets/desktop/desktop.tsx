import { Astal, Gdk, Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";
import Gio from "gi://Gio?version=2.0";
import options from "@/options";
const { name, wallpaper } = options.desktop;

export default (gdkmonitor: Gdk.Monitor) => {
   const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor;

   return (
      <window
         class={name}
         name={name}
         namespace={name}
         gdkmonitor={gdkmonitor}
         exclusivity={Astal.Exclusivity.IGNORE}
         anchor={TOP | BOTTOM | LEFT | RIGHT}
         keymode={Astal.Keymode.NONE}
         layer={Astal.Layer.BACKGROUND}
         application={app}
         visible={true}
      >
         <Gtk.Picture
            file={wallpaper.path.as((p) => Gio.file_new_for_path(p))}
            contentFit={Gtk.ContentFit.COVER}
            canShrink
         />
      </window>
   );
};
