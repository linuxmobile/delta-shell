import app from "ags/gtk4/app";
import { Gtk } from "ags/gtk4";
import { bash } from "../../../utils/utils";
import { icons } from "../../../utils/icons";
import { ClipImage } from "../items/clip_image";
import { ClipText } from "../items/clip_text";
import { ClipColor } from "../items/clip_color";
import { createState, For, onCleanup } from "ags";
import options from "@/options";
const { name, page } = options.launcher;

let windowToggleHandler: number | null = null;

const colorPatterns = {
   hex: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
   rgb: /^rgb\(\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*\)$/,
   rgba: /^rgba\(\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*,\s*([01]?\.\d+)\s*\)$/,
   hsl: /^hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3}%)\s*,\s*(\d{1,3}%)\s*\)$/,
   hsla: /^hsla\(\s*(\d{1,3})\s*,\s*(\d{1,3}%)\s*,\s*(\d{1,3}%)\s*,\s*([01]?\.\d+|\d{1,3}%?)\s*\)$/,
};

const imagePattern = /\[\[ binary data (\d+) (KiB|MiB) (\w+) (\d+)x(\d+) \]\]/;

const [text, text_set] = createState("");
const [cachedList, cachedList_set] = createState<string[]>([]);
let scrolled: Gtk.ScrolledWindow;

const list = text((text) => {
   return cachedList.get().filter((entry) => {
      if (!text) return true;
      const content = entry.split("\t").slice(1).join(" ").trim();
      return content.toLowerCase().includes(text.toLowerCase());
   });
});

const loadInitialList = async () => {
   try {
      cachedList_set([]);
      const list = await bash("cliphist list");
      cachedList_set(list.split("\n").filter((line) => line.trim()));
      text_set("init");
      text_set("");
   } catch (error) {
      console.error("Failed to load clipboard history:", error);
   }
};

onCleanup(() => {
   console.log(1);
});

const ClipButton = ({ item }: { item: string }) => {
   const [id, ...contentParts] = item.split("\t");
   const content = contentParts.join(" ").trim();
   const isImage = content.match(imagePattern);
   const isColor = Object.entries(colorPatterns).find(([_, pattern]) =>
      pattern.test(content.trim()),
   );

   return isColor ? (
      <ClipColor id={id} content={content} />
   ) : isImage ? (
      <ClipImage id={id} content={isImage} />
   ) : (
      <ClipText id={id} content={content} />
   );
};

function Entry() {
   onCleanup(() => {
      if (windowToggleHandler) {
         app.disconnect(windowToggleHandler);
      }
   });
   return (
      <entry
         hexpand
         $={(self) => {
            windowToggleHandler = app.connect(
               "window-toggled",
               async (_, win) => {
                  const winName = win.name;
                  const visible = win.visible;
                  const mode = page.get() == "clipboard";

                  if (winName == name && visible && mode) {
                     scrolled.set_vadjustment(null);
                     await loadInitialList();
                     self.set_text("");
                     self.grab_focus();
                  }
               },
            );
         }}
         placeholderText={"Search..."}
         onNotifyText={(self) => text_set(self.text)}
      />
   );
}

const Clear = () => (
   <button
      class={"clear"}
      onClicked={async () => {
         bash("cliphist wipe");
         await loadInitialList();
      }}
   >
      <image iconName={icons.ui.trash} pixelSize={20} />
   </button>
);

const Header = () => (
   <box>
      <box class={"header"}>
         <Entry />
      </box>
      <Clear />
   </box>
);

const ClipList = () => (
   <scrolledwindow class={"apps-list"} $={(ref) => (scrolled = ref)}>
      <box
         spacing={options.theme.spacing}
         vexpand
         orientation={Gtk.Orientation.VERTICAL}
      >
         <For each={list}>
            {(item) => {
               return <ClipButton item={item} />;
            }}
         </For>
      </box>
   </scrolledwindow>
);

const NotFound = () => (
   <box
      halign={Gtk.Align.CENTER}
      valign={Gtk.Align.CENTER}
      vexpand
      class={"apps-not-found"}
      visible={list.as((l) => l.length === 0)}
   >
      <label label={"No matches found"} />
   </box>
);

export const Clipboard = () => {
   return (
      <box
         name={"clipboard"}
         $type="named"
         orientation={Gtk.Orientation.VERTICAL}
         vexpand
         spacing={options.theme.spacing}
      >
         <Header />
         <NotFound />
         <ClipList />
      </box>
   );
};
