import { icons } from "@/utils/icons";
import { Gtk } from "ags/gtk4";
import AstalPowerProfiles from "gi://AstalPowerProfiles?version=0.1";
import { createBinding } from "ags";
import options from "@/options";
const power = AstalPowerProfiles.get_default();

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
            label={"Power Modes"}
            halign={Gtk.Align.START}
            valign={Gtk.Align.CENTER}
         />
         <box hexpand />
      </box>
   );
}

const profiles_names = {
   "power-saver": "Power Saver",
   balanced: "Balanced",
   performance: "Performance",
};

function Item({ profile }: { profile: string }) {
   const isConnected = createBinding(power, "activeProfile").as(
      (p) => p === profile,
   );

   function setProfile(profile: string) {
      power.set_active_profile(profile);
   }

   return (
      <button
         class="page-button"
         onClicked={() => setProfile(profile)}
         focusOnClick={false}
      >
         <box spacing={options.theme.spacing}>
            <image iconName={icons.powerprofiles[profile]} pixelSize={24} />
            <label label={profiles_names[profile]} />
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
   const list = power.get_profiles();

   return (
      <scrolledwindow>
         <box
            orientation={Gtk.Orientation.VERTICAL}
            spacing={options.theme.spacing}
            vexpand
         >
            {list.map(({ profile }) => (
               <Item profile={profile} />
            ))}
         </box>
      </scrolledwindow>
   );
}

export function PowerModesPage() {
   return (
      <box
         $type={"named"}
         name={"powermodes"}
         cssClasses={["qs-menu-page", "bluetooth-page"]}
         orientation={Gtk.Orientation.VERTICAL}
         spacing={options.theme.spacing}
      >
         <Header />
         <List />
      </box>
   );
}
