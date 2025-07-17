import { Gtk } from "ags/gtk4";
import { CCProps, onCleanup, FCProps } from "ags";
import app from "ags/gtk4/app";
import options from "@/options";

type BarItemProps = JSX.IntrinsicElements["button"] & {
   window?: string;
   children: any;
};

export default function BarItem({
   window = "",
   children,
   ...rest
}: BarItemProps) {
   return (
      <button
         class={"bar-item"}
         $={(self) => {
            if (window) {
               let appconnect: number;
               appconnect = app.connect("window-toggled", (_, win) => {
                  const winName = win.name;
                  if (winName !== window) return;
                  const visible = win.visible;
                  self[visible ? "add_css_class" : "remove_css_class"](
                     "active",
                  );
               });
               onCleanup(() => {
                  if (appconnect) app.disconnect(appconnect);
               });
            }
         }}
         {...rest}
      >
         <box class={"content"}>{children}</box>
      </button>
   );
}
