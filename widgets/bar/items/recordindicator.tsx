import ScreenRecord from "@/services/screenrecord";
import { createBinding } from "ags";
import { Gtk } from "ags/gtk4";
const screenRecord = ScreenRecord.get_default();

export function RecordIndicator() {
   return (
      <button
         cssClasses={["bar-item", "bar-record"]}
         visible={createBinding(screenRecord, "recording")}
         onClicked={() => screenRecord.stop().catch(() => "")}
      >
         <box spacing={10}>
            <box class={"record-indicator"} valign={Gtk.Align.CENTER} />
            <label
               label={createBinding(screenRecord, "timer").as((time) => {
                  const sec = time % 60;
                  const min = Math.floor(time / 60);
                  return `${min}:${sec < 10 ? "0" + sec : sec}`;
               })}
            />
         </box>
      </button>
   );
}
