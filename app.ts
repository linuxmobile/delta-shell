import app from "ags/gtk4/app";
import "@/services/styles";
import windows from "./windows";
import request from "./request";
import Gio from "gi://Gio?version=2.0";

app.start({
   icons: `${SRC}/assets/icons`,
   instanceName: "delta-shell",
main() {
    const monitors = app.get_monitors();
    windows.forEach(({ fn, perMonitor }) => {
        if (perMonitor) {
            monitors.forEach(monitor => fn(monitor));
        } else {
            fn(monitors[0]); // Only call once, pass first monitor for API compatibility
        }
    });
},
});
