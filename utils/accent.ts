import options from "@/options";
const { theme } = options;

export function getAccent(accent: string) {
   switch (accent) {
      case "blue":
         return theme.blue.get();
      case "teel":
         return theme.teel.get();
      case "green":
         return theme.green.get();
      case "yellow":
         return theme.yellow.get();
      case "orange":
         return theme.orange.get();
      case "red":
         return theme.red.get();
      case "purple":
         return theme.purple.get();
      case "slate":
         return theme.slate.get();
      default:
         return theme.blue.get();
   }
}
