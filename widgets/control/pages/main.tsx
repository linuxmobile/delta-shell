import { Gtk } from "ags/gtk4";
import { Header } from "../items/header";
import { Sliders } from "../items/sliders";
import { NotificationsList } from "../items/notifications";
import { MprisPlayers } from "../items/media";
import { Qs_Buttins } from "../items/qsbuttons";
import options from "@/options";

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
