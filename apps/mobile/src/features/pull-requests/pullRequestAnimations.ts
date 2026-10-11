import { FadeIn, FadeOut, LinearTransition, ReduceMotion } from "react-native-reanimated";

// Match the model picker: move existing rows, briefly fade additions and removals.
export const PR_ROW_LAYOUT = LinearTransition.duration(180).reduceMotion(ReduceMotion.System);
export const PR_ROW_ENTER = FadeIn.duration(140).reduceMotion(ReduceMotion.System);
export const PR_ROW_EXIT = FadeOut.duration(100).reduceMotion(ReduceMotion.System);

export const PR_DISCLOSURE_ENTER = FadeIn.delay(80).duration(120).reduceMotion(ReduceMotion.System);
