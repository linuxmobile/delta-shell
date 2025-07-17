import { icons } from "../../../utils/icons";
import app from "ags/gtk4/app";
import { Gdk, Gtk } from "ags/gtk4";
import { onCleanup } from "ags";
import options from "@/options";
import BarItem from "@/widgets/common/baritem";
const { name, page } = options.launcher;

export function Launcher() {
   return (
      <BarItem window={options.launcher.name}>
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
      </BarItem>
   );
}
