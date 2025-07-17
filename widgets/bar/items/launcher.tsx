import { icons } from "../../../utils/icons";
import app from "ags/gtk4/app";
import { Gdk, Gtk } from "ags/gtk4";
import { onCleanup } from "ags";
import options from "@/options";
import BarItem from "@/widgets/common/baritem";
const { name, page } = options.launcher;

export function Launcher() {
   return (
      <BarItem
         window={options.launcher.name}
         onPrimaryClick={() => {
            page.set("apps");
            app.toggle_window(name);
         }}
         onSecondaryClick={() => {
            page.set("clipboard");
            app.toggle_window(name);
         }}
      >
         <image iconName={icons.search} pixelSize={20} />
      </BarItem>
   );
}
