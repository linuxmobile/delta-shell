import { control_page_set } from "../../vars";
import { icons } from "../../../utils/icons";
import { Gtk } from "ags/gtk4";
import AstalPowerProfiles from "gi://AstalPowerProfiles?version=0.1";
import { createBinding } from "ags";
import options from "@/options";
const power = AstalPowerProfiles.get_default();

function Header() {
   return (
      <box class={"header"} hexpand={false} spacing={10}>
         <button
            cssClasses={["qs-header-button", "qs-page-prev"]}
            focusOnClick={false}
            onClicked={() => options.control.page.set("main")}
         >
            <image iconName={icons.ui.arrow.left} pixelSize={20} />
         </button>
         <label
            label={"Power Modes"}
            hexpand={true}
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

   const setProfile = (profile: string) => {
      power.set_active_profile(profile);
   };

   return (
      <button
         class="page-button"
         onClicked={() => setProfile(profile)}
         focusOnClick={false}
      >
         <box spacing={10}>
            <image iconName={icons.powerprofiles[profile]} pixelSize={25} />
            <label label={profiles_names[profile]} />
            <box hexpand={true} />
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
   return (
      <Gtk.ScrolledWindow>
         <box orientation={Gtk.Orientation.VERTICAL} spacing={10} vexpand>
            {power.get_profiles().map(({ profile }) => (
               <Item profile={profile} />
            ))}
         </box>
      </Gtk.ScrolledWindow>
   );
}

export function PowerModesPage() {
   return (
      <box
         $type={"named"}
         name={"powermodes"}
         cssClasses={["qs-menu-page", "bluetooth-page"]}
         orientation={Gtk.Orientation.VERTICAL}
         spacing={10}
      >
         <Header />
         <List />
      </box>
   );
}
