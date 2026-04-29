import { useAppStore } from "@/store/useAppStore";
import {
  runOnJS,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

export const useScrollToHideTabBar = () => {
  const { isTabBarVisible, setTabBarVisible } = useAppStore();
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentOffset = event.contentOffset.y;
      const diff = currentOffset - scrollY.value;

      // Hide on scroll down, show on scroll up
      if (currentOffset > 100) {
        if (diff > 10 && isTabBarVisible) {
          runOnJS(setTabBarVisible)(false);
        } else if (diff < -10 && !isTabBarVisible) {
          runOnJS(setTabBarVisible)(true);
        }
      } else if (!isTabBarVisible) {
        runOnJS(setTabBarVisible)(true);
      }

      scrollY.value = currentOffset;
    },
  });

  return { scrollHandler, scrollY };
};
