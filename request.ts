import app from "ags/gtk4/app";
import options from "./options";
import ScreenRecord from "./services/screenrecord";
const screenrecord = ScreenRecord.get_default();

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
            break;
      }
      return res("ok");
   } else {
      switch (args[0]) {
         case "screenrecord":
            screenrecord.start();
            break;
         default:
            print("Unknown request:", request);
            return res("Unknown request");
            break;
      }
      return res("ok");
   }
}
