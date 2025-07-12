import app from "ags/gtk4/app";
import "@/services/styles";
import windows from "./windows";
import request from "./request";

app.start({
   icons: `${SRC}/assets/icons`,
   instanceName: "delta-shell",
   main() {
      windows.map((win) => app.get_monitors().map(win));
   },
   requestHandler(req, res) {
      request(req, res);
   },
});
