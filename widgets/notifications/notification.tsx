import Pango from "gi://Pango";
import Gtk from "gi://Gtk";
import AstalNotifd from "gi://AstalNotifd";
import GLib from "gi://GLib?version=2.0";
import { isIcon, fileExists } from "../../utils/utils";
import Gio from "gi://Gio?version=2.0";

const time = (time: number, format = "%H:%M") =>
   GLib.DateTime.new_from_unix_local(time).format(format);

function urgency(n: AstalNotifd.Notification) {
   const { LOW, NORMAL, CRITICAL } = AstalNotifd.Urgency
   switch (n.urgency) {
      case LOW:
         return "low"
      case CRITICAL:
         return "critical"
      case NORMAL:
      default:
         return "normal"
   }
}

export const Notification = (props: {
   n: AstalNotifd.Notification;
   showActions?: boolean;
}) => {
   const { n, showActions = true } = props;
   const hasActions = showActions && n.get_actions().length > 0;

   const Header = () => (
      <box
         class={"header"}
         spacing={10}
      >
         {(n.appIcon || isIcon(n.desktopEntry)) && (
            <image
               class={"app-icon"}
               iconName={n.appIcon || n.desktopEntry}
               visible={Boolean(n.appIcon || n.desktopEntry)}
            />
         )}
         <label
            class={"app-name"}
            halign={Gtk.Align.START}
            ellipsize={Pango.EllipsizeMode.END}
            label={n.appName || "Unknown"}
         />
         <label
            class={"time"}
            hexpand
            halign={Gtk.Align.END}
            label={time(n.time)!}
         />
         <button
            onClicked={() => n.dismiss()}
            class={"close"}
            focusOnClick={false}
         >
            <image iconName="window-close-symbolic" />
         </button>
      </box>
   )

   const Content = () => (
      <box
         class={"content"}
         spacing={10}
      >
         {n.image && fileExists(n.image) && (
            <Gtk.ScrolledWindow
               valign={Gtk.Align.START}
               class={"image"}
            >
               <Gtk.Picture
                  contentFit={Gtk.ContentFit.COVER}
                  file={Gio.file_new_for_path(n.image)}
               />
            </Gtk.ScrolledWindow>
         )}
         {n.image && isIcon(n.image) && (
            <box
               class="icon"
               valign={Gtk.Align.START}
            >
               <image
                  iconName={n.image}
                  iconSize={Gtk.IconSize.LARGE}
                  halign={Gtk.Align.CENTER}
                  valign={Gtk.Align.CENTER}
               />
            </box>
         )}
         <box
            hexpand
            orientation={Gtk.Orientation.VERTICAL}
         >
            <label
               class="body"
               maxWidthChars={30}
               wrap={true}
               useMarkup={true}
               wrapMode={Pango.WrapMode.CHAR}
               justify={Gtk.Justification.FILL}
               xalign={0}
               label={n.body ? n.body : n.summary}
            />
         </box>
      </box>
   )

   const Actions = () => (
      <box
         class="actions"
         spacing={10}
      >
         {n.actions.map(({ label, id }) => (
            <button
               hexpand
               onClicked={() => n.invoke(id)}
            >
               <label
                  label={label}
                  halign={Gtk.Align.CENTER}
                  hexpand
               />
            </button>
         ))}
      </box>
   )

   return (
      <box
         orientation={Gtk.Orientation.VERTICAL}
         class={`notification ${urgency(n)}`}
         spacing={10}
      >
         <Header />
         <Content />
         {hasActions && <Actions />}
      </box>
   );
};
