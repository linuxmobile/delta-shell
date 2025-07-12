import app from "ags/gtk4/app";
import { Astal, Gdk } from "ags/gtk4";
import { timeout } from "ags/time";
import Wp from "gi://AstalWp";
import Gtk from "gi://Gtk";
import { icons, VolumeIcon } from "@/utils/icons";
import { Accessor, createState } from "ags";
import options from "@/options";
import Brightness from "@/services/brightness";
const { name, margin, width } = options.osd;

const [visible, visible_set] = createState(false);

function OnScreenProgress({ visible }: { visible: Accessor<boolean> }) {
   const brightness = Brightness.get_default();
   const speaker = Wp.get_default()?.get_default_speaker();

   const [iconName, iconName_set] = createState("");
   const [value, value_set] = createState(0);
   let count = 0;
   let firstStart = true;

   function show(v: number, icon: string) {
      visible_set(true);
      value_set(v);
      iconName_set(icon);
      count++;

      timeout(2000, () => {
         count--;
         if (count === 0) visible_set(false);
      });
   }

   return (
      <box
         $={() => {
            if (brightness) {
               brightness.connect("notify::screen", () => {
                  show(brightness.screen, icons.brightness);
               });
            }

            if (speaker) {
               speaker.connect("notify::volume", () => {
                  if (firstStart) {
                     firstStart = false;
                     return;
                  }

                  show(speaker.volume, VolumeIcon.get());
               });
            }
         }}
      >
         <overlay class={"osd-main"}>
            <image
               $type={"overlay"}
               iconName={iconName((i) => i)}
               class={value((v) => `osd-icon ${v < 0.1 ? "low" : ""}`)}
               valign={Gtk.Align.CENTER}
               halign={Gtk.Align.START}
               pixelSize={24}
            />
            <levelbar
               widthRequest={width}
               valign={Gtk.Align.CENTER}
               value={value((v) => v)}
            />
         </overlay>
      </box>
   );
}

export default function OSD(gdkmonitor: Gdk.Monitor) {
   const { BOTTOM, TOP } = Astal.WindowAnchor;

   return (
      <window
         gdkmonitor={gdkmonitor}
         name={name}
         application={app}
         exclusivity={Astal.Exclusivity.IGNORE}
         anchor={options.bar.position.get() === "top" ? BOTTOM : TOP}
         layer={Astal.Layer.OVERLAY}
         visible={visible((v) => v)}
      >
         <box marginBottom={margin} margin_top={margin}>
            <OnScreenProgress visible={visible} />
         </box>
      </window>
   );
}
