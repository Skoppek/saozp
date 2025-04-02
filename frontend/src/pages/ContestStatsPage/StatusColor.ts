type Color = "gray" | "failure" | "success" | "warning" | "light" | "blue";

export const pointsToColor = (value: number): Color =>
  value < 0 ? "gray"
  : value < 10 ? "failure"
  : value < 30 ? "warning"
  : value < 75 ? "light"
  : value < 100 ? "blue"
  : "success";
