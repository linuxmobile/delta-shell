import AstalBattery from "gi://AstalBattery";
import AstalNetwork from "gi://AstalNetwork";
import AstalBluetooth from "gi://AstalBluetooth";
import AstalNotifd from "gi://AstalNotifd?version=0.1";
import {
   icons,
   VolumeIcon,
   BatteryIcon,
   getNetworkIconBinding,
} from "@/utils/icons";
import app from "ags/gtk4/app";
import { createBinding, createComputed, onCleanup } from "ags";
import options from "@/options";
import BarItem from "@/widgets/common/baritem";
import Wp from "gi://AstalWp";
import { Gtk } from "ags/gtk4";
import { scrollosd } from "@/widgets/osd/osd";
const battery = AstalBattery.get_default();
const bluetooth = AstalBluetooth.get_default();
const network = AstalNetwork.get_default();
const notifd = AstalNotifd.get_default();
const speaker = Wp.get_default()?.get_default_speaker();

export function SysBox() {
   const bluetoothconnected = createComputed(
      [
         createBinding(bluetooth, "devices"),
         createBinding(bluetooth, "isConnected"),
      ],
      (d, _) => {
         for (const device of d) {
            if (device.connected) return true;
         }
         return false;
      },
   );

   return (
      <BarItem
         window={options.control.name}
         onPrimaryClick={() => app.toggle_window(options.control.name)}
      >
         <box spacing={options.bar.spacing}>
            <image
               visible={createBinding(network.wifi, "enabled")}
               pixelSize={20}
               iconName={getNetworkIconBinding()}
            />
            <image visible={bluetoothconnected} iconName={icons.bluetooth} />
            <box>
               <Gtk.EventControllerScroll
                  flags={Gtk.EventControllerScrollFlags.VERTICAL}
                  onScroll={(event, dx, dy) => {
                     if (dy < 0) speaker.set_volume(speaker.volume + 0.01);
                     else if (dy > 0) speaker.set_volume(speaker.volume - 0.01);
                  }}
               />
               <image iconName={VolumeIcon} pixelSize={20} />
            </box>
            <image
               visible={createBinding(battery, "isPresent")}
               pixelSize={20}
               iconName={BatteryIcon}
            />
         </box>
      </BarItem>
   );
}
