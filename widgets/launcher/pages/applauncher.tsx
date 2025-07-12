import app from "ags/gtk4/app";
import Apps from "gi://AstalApps?version=0.1";
import { AppButton } from "../items/app_button";
import { Gtk } from "ags/gtk4";
import { createState, For } from "ags";
import options from "@/options";
const { name, page } = options.launcher;

const apps = new Apps.Apps();
const [text, text_set] = createState("");
let scrolled: Gtk.ScrolledWindow;
const list = text((text) => apps.fuzzy_query(text));

const Entry = () => (
   <entry
      hexpand
      $={(self) => {
         app.connect("window-toggled", (_, win) => {
            const winName = win.name;
            const visible = win.visible;
            const mode = page.get() == "apps";

            if (winName == name && visible && mode) {
               scrolled.set_vadjustment(null);
               text_set("");
               self.set_text("");
               self.grab_focus();
            }
         });
      }}
      placeholderText={"Search..."}
      onNotifyText={(self) => text_set(self.text)}
   />
);

const Header = () => (
   <box class={"header"}>
      <Entry />
   </box>
);

const AppList = () => (
   <scrolledwindow class={"apps-list"} $={(ref) => (scrolled = ref)}>
      <box
         spacing={options.theme.spacing}
         vexpand
         orientation={Gtk.Orientation.VERTICAL}
      >
         <For each={list}>{(app) => <AppButton app={app} />}</For>
      </box>
   </scrolledwindow>
);

const NotFound = () => (
   <box
      halign={Gtk.Align.CENTER}
      valign={Gtk.Align.CENTER}
      vexpand
      class={"apps-not-found"}
      visible={list.as((l) => l.length === 0)}
   >
      <label label={"No match found"} />
   </box>
);

export const AppLauncher = () => (
   <box
      name={"apps"}
      $type="named"
      orientation={Gtk.Orientation.VERTICAL}
      vexpand
      spacing={options.theme.spacing}
   >
      <Header />
      <NotFound />
      <AppList />
   </box>
);
