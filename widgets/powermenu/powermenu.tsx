import Astal from "gi://Astal?version=4.0";
import Gdk from "gi://Gdk";
import Gtk from "gi://Gtk";
import app from "ags/gtk4/app";
import Graphene from "gi://Graphene?version=1.0";
import { icons } from "@/utils/icons";
import Powermenu from "@/utils/powermenu";
import { hide_all_windows } from "@/windows";
import options from "@/options";
const { name } = options.powermenu;
const powermenu = Powermenu.get_default();

type MenuButtonProps = {
   icon: string;
   label: string;
   clicked: () => void;
};

function MenuButton({ icon, label, clicked }: MenuButtonProps) {
   return (
      <button class={"menubutton"} onClicked={clicked} focusOnClick={false}>
         <box
            orientation={Gtk.Orientation.VERTICAL}
            valign={Gtk.Align.CENTER}
            halign={Gtk.Align.CENTER}
            spacing={options.theme.spacing}
         >
            <image iconName={icon} iconSize={Gtk.IconSize.LARGE} />
            <label label={label} />
         </box>
      </button>
   );
}

const list = ["Sleep", "Logout", "Reboot", "Shutdown"];

function PowerMenu() {
   return (
      <box class={"main"} spacing={options.theme.main_padding}>
         {list.map((value) => (
            <MenuButton
               icon={icons.powermenu[value.toLowerCase()]}
               label={value}
               clicked={() => powermenu.action(value)}
            />
         ))}
      </box>
   );
}

export default function (gdkmonitor: Gdk.Monitor) {
   const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor;
   let win: Astal.Window;
   let contentbox: Gtk.Box;

   function onKey(
      _e: Gtk.EventControllerKey,
      keyval: number,
      _: number,
      mod: number,
   ) {
      if (keyval === Gdk.KEY_Escape) {
         hide_all_windows();
      }
   }

   function onClick(_e: Gtk.GestureClick, _: number, x: number, y: number) {
      const [, rect] = contentbox.compute_bounds(win);
      const position = new Graphene.Point({ x, y });

      if (!rect.contains_point(position)) {
         hide_all_windows();
      }
   }

   return (
      <window
         $={(ref) => (win = ref)}
         class={name}
         name={name}
         gdkmonitor={gdkmonitor}
         exclusivity={Astal.Exclusivity.NORMAL}
         anchor={TOP | BOTTOM | LEFT | RIGHT}
         keymode={Astal.Keymode.ON_DEMAND}
         layer={Astal.Layer.TOP}
         application={app}
         visible={false}
         onNotifyVisible={({ visible }) => {
            if (visible) contentbox.grab_focus();
         }}
      >
         <Gtk.EventControllerKey onKeyPressed={onKey} />
         <Gtk.GestureClick onPressed={onClick} />
         <box
            $={(ref) => (contentbox = ref)}
            focusable
            halign={Gtk.Align.CENTER}
            valign={Gtk.Align.CENTER}
            orientation={Gtk.Orientation.VERTICAL}
         >
            <PowerMenu />
         </box>
      </window>
   );
}
