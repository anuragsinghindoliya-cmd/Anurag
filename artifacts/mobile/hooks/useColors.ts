import colors from "@/constants/colors";

/**
 * Always returns the dark palette for this app.
 * This planner is designed as a dark-themed app.
 */
export function useColors() {
  const palette = (colors as Record<string, typeof colors.light>).dark ?? colors.light;
  return { ...palette, radius: colors.radius };
}
