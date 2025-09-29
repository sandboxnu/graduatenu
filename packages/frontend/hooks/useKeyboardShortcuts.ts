import { useEffect } from "react";
import { useRouter } from "next/router";

// represents a keyboard shortcut
interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  callback: () => void;
  disabled?: boolean;
}

interface UseKeyboardShortcutsOptions {
  shortcuts: KeyboardShortcut[];
  disabledRoutes?: string[];
}

// hook for managing keyboard shortcuts
// can be used globally (w/ ShortcutsProvider) or on individual pages/components.
// shortcuts: an array of keyboard shortcuts to register
// disabledRoutes: routes where the shortcut should be disabled (defaults to landing page)
export const useKeyboardShortcuts = (
  options: UseKeyboardShortcutsOptions
): void => {
  const { shortcuts, disabledRoutes = ["/"] } = options;
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const currentPath = router.asPath;
      const isDisabledRoute = disabledRoutes.includes(currentPath);

      // skip action if on disabled route
      if (isDisabledRoute) return;

      shortcuts.forEach((shortcut) => {
        // skip if a shortcut is disabled
        if (shortcut.disabled) return;

        // check if all key combos match (case-insensitive)
        const keyMatches =
          event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatches = (shortcut.ctrlKey ?? false) === event.ctrlKey;
        const shiftMatches = (shortcut.shiftKey ?? false) === event.shiftKey;
        const altMatches = (shortcut.altKey ?? false) === event.altKey;

        if (keyMatches && ctrlMatches && shiftMatches && altMatches) {
          event.preventDefault();
          shortcut.callback();
        }
      });
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts, disabledRoutes, router.asPath]);
};
