import { Gtk } from "ags/gtk4";
import { Sliders } from "../items/sliders";
import { NotificationsList } from "../items/notifications";
import { MprisPlayers } from "../items/media";
import { Qs_Buttins } from "../items/qsbuttons";
import options from "@/options";
import { BatteryIcon, icons } from "@/utils/icons";
import AstalBattery from "gi://AstalBattery?version=0.1";
import app from "ags/gtk4/app";
import { bash } from "@/utils/utils";
import { createBinding } from "ags";
import { timeout } from "ags/time";
import ScreenRecord from "@/services/screenrecord";
const battery = AstalBattery.get_default();
const screenRecord = ScreenRecord.get_default();

function Power() {
   return (
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
}

function Record() {
   return (
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
}

function Settings() {
   return (
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
}

function Battery() {
   return (
      <button
         cssClasses={["qs-header-button", "battery-button"]}
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
}

export function Header() {
   return (
      <box spacing={10} class={"header"} hexpand={false}>
         <Battery />
         <box hexpand />
         <Record />
         <Power />
         <Settings />
      </box>
   );
}

export function MainPage() {
   return (
      <box
         $type={"named"}
         name={"main"}
         cssClasses={["qs-main-page", "wifi-page"]}
         orientation={Gtk.Orientation.VERTICAL}
         spacing={options.theme.spacing}
      >
         <Header />
         <Qs_Buttins />
         <Sliders />
         <MprisPlayers />
         <NotificationsList />
      </box>
   );
}
