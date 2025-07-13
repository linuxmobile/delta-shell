import { icons } from "../../../utils/icons";
import app from "ags/gtk4/app";
import { Gdk, Gtk } from "ags/gtk4";
import { onCleanup } from "ags";
import options from "@/options";
const { name, page } = options.launcher;

export function Launcher() {
   let appconnect: number;

   onCleanup(() => {
      if (appconnect) app.disconnect(appconnect);
   });

   return (
      <box
         cssClasses={["bar-item", "launcher"]}
         $={(self) => {
            appconnect = app.connect("window-toggled", (_, win) => {
               const winName = win.name;
               const visible = win.visible;

               if (winName == name) {
                  self[visible ? "add_css_class" : "remove_css_class"](
                     "active",
                  );
               }
            });
         }}
      >
         <Gtk.GestureClick
            onPressed={(ctrl, _, x, y) => {
               const button = ctrl.get_current_button();
               if (button === Gdk.BUTTON_PRIMARY) {
                  page.set("apps");
                  app.toggle_window(name);
               } else if (button === Gdk.BUTTON_SECONDARY) {
                  page.set("clipboard");
                  app.toggle_window(name);
               }
            }}
            button={0}
         />
         <image iconName={icons.search} pixelSize={20} />
      </box>
   );
}
