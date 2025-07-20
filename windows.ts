import Bar from "./widgets/bar/bar";
import OSD from "./widgets/osd/osd";
import Launcher from "./widgets/launcher/launcher";
import Control from "./widgets/control/control";
import Calendar from "./widgets/calendar/calendar";
import Powermenu from "./widgets/powermenu/powermenu";
import Verification from "./widgets/powermenu/verification";
import { NotificationPopup } from "./widgets/notifications/notificationpopup";
import app from "ags/gtk4/app";
import options from "./options";

export function hide_all_windows() {
   app.get_window(options.launcher.name)?.hide();
   app.get_window(options.powermenu.name)?.hide();
   app.get_window(options.verification.name)?.hide();
   app.get_window(options.calendar.name)?.hide();
   app.get_window(options.control.name)?.hide();
   options.control.page.set("main");
}

const monitors = app.get_monitors();

const windows = [
    // Bar only on first monitor
    { fn: (monitor) => monitor === monitors[0] ? Bar(monitor) : null, perMonitor: true },
    // OSD only on first monitor
    { fn: (monitor) => monitor === monitors[0] ? OSD(monitor) : null, perMonitor: true },
    // NotificationPopup per monitor
    { fn: NotificationPopup, perMonitor: true },
    // The rest are global
    { fn: Launcher, perMonitor: false },
    { fn: Control, perMonitor: false },
    { fn: Powermenu, perMonitor: false },
    { fn: Verification, perMonitor: false },
    { fn: Calendar, perMonitor: false },
];

export default windows;
