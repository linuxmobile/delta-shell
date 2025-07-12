import { Astal, Gtk } from "ags/gtk4";
import AstalRiver from "gi://AstalRiver?version=0.1";
import { createBinding, createComputed, For } from "ags";
import options from "@/options";
const river = AstalRiver.get_default();

function getActiveTags(bitmask: number): number[] {
   const activeTags: number[] = [];

   let tag = 0;
   while (bitmask > 0) {
      if (bitmask & 1) {
         activeTags.push(tag);
      }
      bitmask >>= 1;
      tag++;
   }

   return activeTags;
}

export function Workspaces_River() {
   const output = river!.get_output("eDP-1");
   if (output == null) return;

   const focusedTags = createBinding(output, "focusedTags");
   const urgentTags = createBinding(output, "urgentTags");

   const activeTags = createComputed(
      [
         createBinding(output, "occupiedTags"),
         createBinding(output, "focusedTags"),
      ],
      (occupied, focused) => {
         return getActiveTags(occupied | focused);
      },
   );

   return (
      <box cssClasses={["tags", "module"]} spacing={10}>
         <For each={activeTags}>
            {(tag: number) => {
               const isFocused = focusedTags.as((v) => Boolean(v & (1 << tag)));
               const isUrgent = urgentTags.as((v) => Boolean(v & (1 << tag)));

               return (
                  <button
                     cssClasses={[
                        "tag",
                        isFocused.get() ? "focused" : "",
                        isUrgent.get() ? "urgent" : "",
                     ]}
                     onClicked={(_) =>
                        river?.run_command_async(
                           ["set-focused-tags", `${1 << tag}`],
                           null,
                        )
                     }
                  >
                     <label label={`${tag + 1}`} />
                  </button>
               );
            }}
         </For>
      </box>
   );
}
