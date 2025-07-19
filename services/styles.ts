import { monitorFile, writeFileAsync } from "ags/file";
import app from "ags/gtk4/app";
import { bash, dependencies } from "@/utils/utils";
import options from "@/options";
import { Opt } from "@/utils/options";
import GLib from "gi://GLib?version=2.0";
import { getAccent } from "@/utils/accent";

const { theme } = options;
const { main_padding, spacing, radius, border, outline } = options.theme;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const $ = (name: string, value: string | Opt<any>) => `$${name}: ${value};`;

const variables = () => [
   $("font-size", `${options.font.size.get()}pt`),
   $("font-name", `${options.font.name.get()}`),

   $("bg0", theme.bg[0].get()),
   $("bg1", theme.bg[1].get()),
   $("bg2", theme.bg[2].get()),
   $("bg3", theme.bg[3].get()),

   $("fg0", theme.fg[0].get()),
   $("fg1", theme.fg[1].get()),
   $("fg2", theme.fg[2].get()),

   $("accent1", theme.accent.get()),
   $("accent2", `lighten(${theme.accent.get()}, 10%)`),
   $("blue1", theme.blue.get()),
   $("blue2", `lighten(${theme.blue.get()}, 10%)`),
   $("green1", theme.green.get()),
   $("green2", `lighten(${theme.green.get()}, 10%)`),
   $("yellow1", theme.yellow.get()),
   $("yellow2", `lighten(${theme.yellow.get()}, 10%)`),
   $("orange1", theme.orange.get()),
   $("orange2", `lighten(${theme.orange.get()}, 10%)`),
   $("red1", theme.red.get()),
   $("red2", `lighten(${theme.red.get()}, 10%)`),
   $("purple1", theme.purple.get()),
   $("purple", `lighten(${theme.purple.get()}, 10%)`),

   $("border-color", border.color.get()),
   $("outline-color", outline.color.get()),

   $("outline-width", `${outline.width.get()}px`),
   $("border-width", `${border.width.get()}px`),
   $("widget-main-padding", `${main_padding.get()}px`),
   $("widget-radius", `${radius.get()}px`),
   $(
      "widget-main-radius",
      `${radius.get() === 0 ? radius.get() : radius.get() + main_padding.get()}px`,
   ),

   $("transition-background", `background ${options.transition.get()}ms`),
   $("transition-color", `color ${options.transition.get()}ms`),
   $("transition-all", `all ${options.transition.get()}ms`),

   $("bar-position", options.bar.position.get()),
];

export async function resetCss() {
   if (!dependencies("sass", "fd")) return;

   try {
      const vars = `${GLib.get_tmp_dir()}/delta-shell/variables.scss`;
      const scss = `${GLib.get_tmp_dir()}/delta-shell/main.scss`;
      const css = `${GLib.get_tmp_dir()}/delta-shell/main.css`;

      const fd = await bash(`fd ".scss" ${SRC}`);
      const files = fd.split(/\s+/);
      const imports = [vars, ...files].map((f) => `@import '${f}';`);

      await writeFileAsync(vars, variables().join("\n"));
      await writeFileAsync(scss, imports.join("\n"));
      await bash(`sass ${scss} ${css}`);

      app.apply_css(css, true);
   } catch (error) {
      if (error instanceof Error) {
         logError(error);
      } else {
         console.error(error);
      }
   }
}

monitorFile(`${SRC}/styles`, resetCss);
await resetCss();
