import { Gtk } from "ags/gtk4";
import { QSButton } from "../../common/qsbutton";
import { getNetworkIconBinding, icons } from "../../../utils/icons";
import Network from "gi://AstalNetwork?version=0.1";
import AstalNotifd from "gi://AstalNotifd?version=0.1";
import Bluetooth from "gi://AstalBluetooth?version=0.1";
import AstalPowerProfiles from "gi://AstalPowerProfiles?version=0.1";
import { createBinding, createComputed } from "ags";
import options from "@/options";
import { resetCss } from "@/services/styles";

function PowerProfilesButton() {
   const powerprofile = AstalPowerProfiles.get_default();
   const activeprofile = createBinding(powerprofile, "activeProfile");

   const profiles_names = {
      "power-saver": "Power Saver",
      balanced: "Balanced",
      performance: "Performance",
   };

   return (
      <QSButton
         icon={activeprofile.as((profile) => icons.powerprofiles[profile])}
         label={"Power Modes"}
         subtitle={activeprofile.as((profile) => profiles_names[profile])}
         showArrow={true}
         onClicked={() => {
            const setprofile = activeprofile.as((profile) => {
               if (profile == "performance" || profile == "power-saver") {
                  return "balanced";
               } else {
                  return "performance";
               }
            });
            powerprofile.set_active_profile(setprofile.get());
         }}
         onArrowClicked={() => options.control.page.set("powermodes")}
         ArrowClasses={createBinding(powerprofile, "activeProfile").as(
            (profile) => {
               const classes = ["arrow"];
               if (profile == "performance" || profile == "power-saver") {
                  classes.push("active");
               }
               return classes;
            },
         )}
         ButtonClasses={createBinding(powerprofile, "activeProfile").as(
            (profile) => {
               const classes = ["qs-button-box-arrow"];
               if (profile == "performance" || profile == "power-saver") {
                  classes.push("active");
               }
               return classes;
            },
         )}
      />
   );
}

function WifiButton() {
   const wifi = Network.get_default().wifi;
   const wifiSsid = createComputed(
      [createBinding(wifi, "state"), createBinding(wifi, "ssid")],
      (state, ssid) => {
         return state == Network.DeviceState.ACTIVATED
            ? ssid
            : Network.device_state_to_string();
      },
   );

   return (
      <QSButton
         icon={getNetworkIconBinding()}
         label={"Wi-Fi"}
         subtitle={wifiSsid((text) => (text !== "unknown" ? text : "None"))}
         onClicked={() => wifi.set_enabled(!wifi.enabled)}
         onArrowClicked={() => {
            wifi.scan();
            options.control.page.set("network");
         }}
         showArrow={true}
         ArrowClasses={createBinding(wifi, "enabled").as((p) => {
            const classes = ["arrow"];
            p && classes.push("active");
            return classes;
         })}
         ButtonClasses={createBinding(wifi, "enabled").as((p) => {
            const classes = ["qs-button-box-arrow"];
            p && classes.push("active");
            return classes;
         })}
      />
   );
}

function DNDButton() {
   const notifd = AstalNotifd.get_default();

   return (
      <QSButton
         icon={icons.bell}
         label={"Don't Disturb"}
         onClicked={() => notifd.set_dont_disturb(!notifd.dontDisturb)}
         ButtonClasses={createBinding(notifd, "dontDisturb").as((p) => {
            const classes = ["qs-button-box"];
            p && classes.push("active");
            return classes;
         })}
      />
   );
}

function BluetoothButton() {
   const bluetooth = Bluetooth.get_default();
   const deviceConnected = createComputed(
      [
         createBinding(bluetooth, "devices"),
         createBinding(bluetooth, "isConnected"),
      ],
      (d, _) => {
         for (const device of d) {
            if (device.connected) return device.name;
         }
         return "No device";
      },
   );

   return (
      <QSButton
         icon={icons.bluetooth}
         label={"Bluetooth"}
         subtitle={deviceConnected((text) =>
            text !== "No device" ? text : "None",
         )}
         showArrow={true}
         onClicked={() => bluetooth.toggle()}
         onArrowClicked={() => options.control.page.set("bluetooth")}
         ArrowClasses={createBinding(bluetooth, "isPowered").as((p) => {
            const classes = ["arrow"];
            p && classes.push("active");
            return classes;
         })}
         ButtonClasses={createBinding(bluetooth, "isPowered").as((p) => {
            const classes = ["qs-button-box-arrow"];
            p && classes.push("active");
            return classes;
         })}
      />
   );
}

function Qs_Row_1() {
   return (
      <box spacing={options.theme.spacing} homogeneous={true}>
         <WifiButton />
         <BluetoothButton />
      </box>
   );
}

function Qs_Row_2() {
   return (
      <box spacing={options.theme.spacing} homogeneous={true}>
         <PowerProfilesButton />
         <DNDButton />
      </box>
   );
}

export function Qs_Buttins() {
   return (
      <box
         spacing={options.theme.spacing}
         class={"qs-buttons"}
         orientation={Gtk.Orientation.VERTICAL}
      >
         <Qs_Row_1 />
         <Qs_Row_2 />
      </box>
   );
}
