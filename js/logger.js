export class Logger {
  static log(logText, debugLebel="Info") {
    if (Config.DEBUG_MODE) {
      switch (debugLebel) {
        case "Info":
          console.Info(logText);
          break;
        case "Error":
          console.error(logText);
          break;
        case "Warn":
          console.warn(logText);
        default:
          break;
      }
    }
  }
}
