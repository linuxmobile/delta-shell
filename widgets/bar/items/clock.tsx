import app from "ags/gtk4/app";
import GLib from "gi://GLib";
import { createPoll } from "ags/time";
import { onCleanup } from "ags";
import options from "@/options";
import BarItem from "@/widgets/common/baritem";

const { format } = options.bar.date;

export function Clock() {
   const time = createPoll(
      "",
      1000,
      () => GLib.DateTime.new_now_local().format(format.get())!,
   );

   return (
      <BarItem
         window={options.calendar.name}
         onPrimaryClick={() => app.toggle_window(options.calendar.name)}
      >
         <label label={time((t) => t)} />
      </BarItem>
   );
}
