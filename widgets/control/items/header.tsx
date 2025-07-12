import { BatteryIcon, icons } from "../../../utils/icons";
import AstalBattery from "gi://AstalBattery?version=0.1";
import app from "ags/gtk4/app";
import { bash } from "../../../utils/utils";
import { createBinding } from "ags";
import { timeout } from "ags/time";
import options from "@/options";
import ScreenRecord from "@/services/screenrecord";
const battery = AstalBattery.get_default();
const screenRecord = ScreenRecord.get_default();

const Power = () => (
   <button
      class={"qs-header-button"}
      tooltipText={"Power Menu"}
      focusOnClick={false}
      onClicked={() => {
         app.get_window(options.powermenu.name)?.show();
         app.get_window(options.control.name)?.hide();
      }}
   >
      <image iconName={icons.powermenu.shutdown} pixelSize={20} />
   </button>
);

const Record = () => (
   <button
      class={"qs-header-button"}
      tooltipText={"Screen Record"}
      focusOnClick={false}
      onClicked={() => {
         if (screenRecord.recording) {
            screenRecord.stop();
         } else {
            app.toggle_window(options.control.name);
            timeout(200, () => {
               screenRecord.start();
            });
         }
         app.get_window(options.control.name)?.hide();
      }}
   >
      <image iconName={icons.video} pixelSize={20} />
   </button>
);

const Settings = () => (
   <button
      class={"qs-header-button"}
      focusOnClick={false}
      tooltipText={"Settings"}
      onClicked={() => {
         bash(`XDG_CURRENT_DESKTOP=gnome gnome-control-center`);
         app.get_window(options.control.name)?.hide();
      }}
   >
      <image iconName={icons.settings} pixelSize={20} />
   </button>
);

const Battery = () => (
   <button
      cssClasses={["qs-header-button", "battery-button"]}
      tooltipText={"Power Profiles"}
      focusOnClick={false}
      onClicked={() => {
         bash("XDG_CURRENT_DESKTOP=gnome gnome-control-center power");
         app.get_window(options.control.name)?.hide();
      }}
   >
      <box spacing={10}>
         <image iconName={BatteryIcon} pixelSize={24} />
         <label
            label={createBinding(battery, "percentage").as(
               (p) => `${Math.floor(p * 100)}%`,
            )}
         />
      </box>
   </button>
);

export const Header = () => (
   <box spacing={10} class={"header"} hexpand={false}>
      <Battery />
      <box hexpand />
      <Record />
      <Power />
      <Settings />
   </box>
);
