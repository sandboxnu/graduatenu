import { useEffect } from "react";
import { useRouter } from "next/router";

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

export const useKeyboardShortcuts = (
  options: UseKeyboardShortcutsOptions
): void => {
  const { shortcuts, disabledRoutes = ["/"] } = options;
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const currentPath = router.asPath;
      const isDisabledRoute = disabledRoutes.includes(currentPath);

      if (isDisabledRoute) return;

      shortcuts.forEach((shortcut) => {
        if (shortcut.disabled) return;

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
