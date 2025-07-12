import app from "ags/gtk4/app";
import GLib from "gi://GLib";
import { createPoll } from "ags/time";
import { onCleanup } from "ags";
import options from "@/options";

const { format } = options.bar.date;

export function Clock() {
   let appconnect: number;
   const time = createPoll(
      "",
      1000,
      () => GLib.DateTime.new_now_local().format(format.get())!,
   );

   onCleanup(() => {
      if (appconnect) app.disconnect(appconnect);
   });

   return (
      <button
         onClicked={() => app.toggle_window(options.calendar.name)}
         cssClasses={["bar-item", "clock"]}
         $={(self) => {
            appconnect = app.connect("window-toggled", (_, win) => {
               const winName = win.name;
               const visible = win.visible;

               if (winName == options.calendar.name) {
                  self[visible ? "add_css_class" : "remove_css_class"](
                     "active",
                  );
               }
            });
         }}
      >
         <label label={time((t) => t)} />
      </button>
   );
}
