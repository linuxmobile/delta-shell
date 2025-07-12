import options from "@/options";
import { createState, onCleanup } from "ags";
import Gio from "gi://Gio?version=2.0";

const backgroundSettings = new Gio.Settings({
   schema_id: "org.gnome.desktop.background",
});
const interfaceSettings = new Gio.Settings({
   schema_id: "org.gnome.desktop.interface",
});

export function getWallpaper() {
   try {
      const darkMode =
         interfaceSettings.get_string("color-scheme") === "prefer-dark";
      const uri = darkMode
         ? backgroundSettings.get_string("picture-uri-dark")
         : backgroundSettings.get_string("picture-uri");
      return Gio.File.new_for_uri(uri).get_path() || "";
   } catch (error) {
      console.error("Error: can't get wallpaper:", error);
      return "";
   }
}

const wall_change = backgroundSettings.connect("changed::picture-uri", () => {
   options.desktop.wallpaper.path.set(getWallpaper());
});

const color_change = interfaceSettings.connect("changed::color-scheme", () => {
   options.desktop.wallpaper.path.set(getWallpaper());
});
