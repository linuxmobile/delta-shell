import { Gtk } from "ags/gtk4";
import AstalNotifd from "gi://AstalNotifd?version=0.1";
import { Notification } from "../../notifications/notification";
import { icons } from "../../../utils/icons";
import { createBinding, For } from "ags";
const notifd = AstalNotifd.get_default();

function Clear() {
   return (
      <button
         class={"notifs-clear"}
         focusOnClick={false}
         onClicked={() => {
            notifd.notifications.forEach((n) => n.dismiss());
         }}
      >
         <image
            halign={Gtk.Align.CENTER}
            iconName={icons.ui.trash}
            pixelSize={20}
         />
      </button>
   );
}

function Header() {
   return (
      <box class={"notifs-list-header"}>
         <label label={"Notifications"} />
         <box hexpand />
         <Clear />
      </box>
   );
}

function NotFound() {
   return (
      <box
         halign={Gtk.Align.CENTER}
         valign={Gtk.Align.CENTER}
         class={"notifs-not-found"}
         vexpand
         visible={createBinding(notifd, "notifications").as(
            (n) => n.length === 0,
         )}
      >
         <label label={"Your inbox is empty"} />
      </box>
   );
}

const list = createBinding(notifd, "notifications").as((notifs) =>
   notifs.sort((a, b) => b.time - a.time),
);

function Notifications() {
   return (
      <scrolledwindow vexpand>
         <box
            class={"notifs-list"}
            orientation={Gtk.Orientation.VERTICAL}
            spacing={10}
         >
            <For each={list}>
               {(notif) => <Notification n={notif} showActions={true} />}
            </For>
         </box>
      </scrolledwindow>
   );
}

export function NotificationsList() {
   return (
      <box spacing={10} hexpand={false} orientation={Gtk.Orientation.VERTICAL}>
         <Header />
         <NotFound />
         <Notifications />
      </box>
   );
}
