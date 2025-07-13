import AstalNotifd from "gi://AstalNotifd";
import { Notification } from "./notification";
import Astal from "gi://Astal";
import { Gdk, Gtk } from "ags/gtk4";
import { createBinding, createState, For, onCleanup } from "ags";
import app from "ags/gtk4/app";
import GLib from "gi://GLib";
import options from "@/options";
const notifd = AstalNotifd.get_default();
const { name, margin, timeout } = options.notifications_popup;

export function NotificationPopup(gdkmonitor: Gdk.Monitor) {
   const [notifications, notifications_set] = createState(
      new Array<AstalNotifd.Notification>(),
   );

   const scheduleNotificationRemoval = (id: number) => {
      GLib.timeout_add(GLib.PRIORITY_DEFAULT, timeout.get(), () => {
         notifications_set((ns) => ns.filter((n) => n.id !== id));
         return GLib.SOURCE_REMOVE;
      });
   };

   const notifiedHandler = notifd.connect("notified", (_, id, replaced) => {
      const notification = notifd.get_notification(id);

      if (replaced) {
         notifications_set((ns) =>
            ns.map((n) => (n.id === id ? notification : n)),
         );
      } else {
         notifications_set((ns) => [notification, ...ns]);
         scheduleNotificationRemoval(id);
      }
   });

   const resolvedHandler = notifd.connect("resolved", (_, id) => {
      notifications_set((ns) => ns.filter((n) => n.id !== id));
   });

   onCleanup(() => {
      notifd.disconnect(notifiedHandler);
      notifd.disconnect(resolvedHandler);
   });

   return (
      <window
         class={name}
         gdkmonitor={gdkmonitor}
         name={name}
         visible={notifications((ns) => ns.length > 0)}
         anchor={Astal.WindowAnchor.TOP}
      >
         <box
            orientation={Gtk.Orientation.VERTICAL}
            spacing={options.theme.spacing}
            marginTop={margin}
            marginBottom={margin}
         >
            <For each={notifications}>
               {(n) => <Notification n={n} showActions={true} />}
            </For>
         </box>
      </window>
   );
}
