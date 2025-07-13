import AstalNetwork from "gi://AstalNetwork";
import { bash } from "@/utils/utils";
import { icons, getAccessPointIcon } from "@/utils/icons";
import { Gtk } from "ags/gtk4";
import { createBinding, For } from "ags";
import options from "@/options";
const wifi = AstalNetwork.get_default().wifi;

function ScanningIndicator() {
   const className = createBinding(wifi, "scanning").as((scanning) => {
      const classes = ["scanning"];
      if (scanning) {
         classes.push("active");
      }
      return classes;
   });

   return (
      <image
         iconName={icons.ui.refresh}
         pixelSize={20}
         cssClasses={className}
      />
   );
}

function Header() {
   return (
      <box class={"header"} spacing={options.theme.spacing}>
         <button
            cssClasses={["qs-header-button", "qs-page-prev"]}
            focusOnClick={false}
            onClicked={() => options.control.page.set("main")}
         >
            <image iconName={icons.ui.arrow.left} pixelSize={20} />
         </button>
         <label
            label={"Wi-Fi"}
            halign={Gtk.Align.START}
            valign={Gtk.Align.CENTER}
         />
         <box hexpand />
         <button
            cssClasses={["qs-header-button", "qs-page-refresh"]}
            focusOnClick={false}
            onClicked={() => wifi.scan()}
         >
            <ScanningIndicator />
         </button>
      </box>
   );
}

type ItemProps = {
   accessPoint: AstalNetwork.AccessPoint;
};

function Item({ accessPoint }: ItemProps) {
   const isConnected = createBinding(wifi, "ssid").as(
      (ssid) => ssid === accessPoint.ssid,
   );

   return (
      <button
         class="page-button"
         onClicked={() =>
            bash(`nmcli device wifi connect ${accessPoint.bssid}`)
         }
         focusOnClick={false}
      >
         <box spacing={options.theme.spacing}>
            <image iconName={getAccessPointIcon(accessPoint)} pixelSize={20} />
            <label label={accessPoint.ssid} />
            <box hexpand />
            <image
               iconName={icons.ui.check}
               pixelSize={20}
               visible={isConnected}
            />
         </box>
      </button>
   );
}

function List() {
   const list = createBinding(wifi, "accessPoints").as((aps) =>
      aps.filter((ap) => !!ap.ssid).sort((a, b) => b.strength - a.strength),
   );

   return (
      <scrolledwindow>
         <box
            orientation={Gtk.Orientation.VERTICAL}
            spacing={options.theme.spacing}
            vexpand
         >
            <For each={list}>{(ap) => <Item accessPoint={ap} />}</For>
         </box>
      </scrolledwindow>
   );
}

export function NetworkPage() {
   return (
      <box
         $type={"named"}
         name={"network"}
         cssClasses={["qs-menu-page", "wifi-page"]}
         orientation={Gtk.Orientation.VERTICAL}
         spacing={options.theme.spacing}
      >
         <Header />
         <List />
      </box>
   );
}
