import { Astal, Gdk, Gtk } from "ags/gtk4";
import AstalNiri from "gi://AstalNiri";
import AstalApps from "gi://AstalApps";
import { createBinding, createComputed, For } from "ags";
import options, { compositor } from "@/options";
import { bash } from "@/utils/utils";
const niri = AstalNiri.get_default();

type AppButtonProps = {
   app?: AstalApps.Application;
   client: AstalNiri.Window;
};

const application = new AstalApps.Apps();

function AppButton({ app, client }: AppButtonProps) {
   const classes = createBinding(niri, "focusedWindow").as((fcsClient) => {
      const classes = ["taskbar-button"];
      if (!fcsClient || !client.app_id || !fcsClient.app_id) return classes;
      const isFocused = fcsClient.id === client?.id;
      if (isFocused) classes.push("focused");
      return classes;
   });

   return (
      <box cssClasses={classes}>
         <Gtk.GestureClick
            onPressed={(ctrl, _, x, y) => {
               const button = ctrl.get_current_button();
               if (button === Gdk.BUTTON_PRIMARY) {
                  client.focus(client.id);
               } else if (button === Gdk.BUTTON_MIDDLE) {
                  bash(`niri msg action close-window --id ${client.id}`);
               }
            }}
            button={0}
         />
         <overlay>
            <image
               $type="overlay"
               tooltipText={client.title}
               halign={Gtk.Align.CENTER}
               valign={Gtk.Align.CENTER}
               iconName={app ? app.iconName : client.app_id}
               pixelSize={20}
            />
            <box
               class="indicator"
               valign={options.bar.position.as((p) =>
                  p === "top" ? Gtk.Align.START : Gtk.Align.END,
               )}
               halign={Gtk.Align.CENTER}
            />
         </overlay>
      </box>
   );
}

function WorkspaceButton({ ws }: { ws: AstalNiri.Workspace }) {
   const clients = createBinding(ws, "windows").as((clients) =>
      clients.sort((a, b) => a.id - b.id),
   );

   const classNames = createBinding(niri, "focusedWorkspace").as((fws) => {
      const classes = ["workspace-container"];

      const active = fws?.id == ws.id;
      if (active) {
         classes.push("active");
      }

      return classes;
   });

   return (
      <box cssClasses={classNames}>
         <button class={"workspace-button"} onClicked={() => ws.focus()}>
            <label label={ws.idx.toString()} />
         </button>
         <For each={clients}>
            {(client: AstalNiri.Window) => {
               for (const app of application.list) {
                  if (
                     client.app_id &&
                     app.entry
                        .split(".desktop")[0]
                        .toLowerCase()
                        .match(client.app_id.toLowerCase())
                  ) {
                     return <AppButton app={app} client={client} />;
                  }
               }
               return <AppButton client={client} />;
            }}
         </For>
      </box>
   );
}

export function Workspaces_Niri() {
   const workspaces = createBinding(niri, "workspaces").as((workspaces) =>
      workspaces.sort((a, b) => a.id - b.id),
   );

   return (
      <box spacing={options.bar.spacing} class={"workspaces"}>
         <For each={workspaces}>{(ws) => <WorkspaceButton ws={ws} />}</For>
      </box>
   );
}
