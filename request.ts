import app from "ags/gtk4/app";
import options from "./options";

export default function request(
   request: string,
   res: (response: any) => void,
): void {
   const args = request.split(" ");
   if (args[0] == "toggle" && args[1]) {
      switch (args[1]) {
         case "applauncher":
            options.launcher.page.set("apps");
            app.toggle_window("launcher");
            break;
         case "clipboard":
            options.launcher.page.set("clipboard");
            app.toggle_window("launcher");
            break;
         default:
            print("Unknown request:", request);
            return res("Unknown request");
      }
      return res("ok");
   } else {
      return res("Unknown request");
   }
}
