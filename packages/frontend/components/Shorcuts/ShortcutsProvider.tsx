import React, { useContext } from "react";
import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts";
import { useWindowSize } from "../../hooks";
import { NewPlanModalContext } from "../../pages/_app";

interface ShortcutsProviderProps {
  children?: React.ReactNode;
}

// Shortcuts provider to manage app-wide keyboard shortcuts
// is currently wrapped around _app.tsx to enable shortcuts throughout the app
// shortcuts are automatically disabled on the landing, login, and disabled screen pages
export const ShortcutsProvider = ({ children }: ShortcutsProviderProps) => {
  const { setIsNewPlanModalOpen } = useContext(NewPlanModalContext);
  const { width } = useWindowSize();

  const disableApp = width ? width <= 1100 : false;

  useKeyboardShortcuts({
    shortcuts: [
      {
        key: "N",
        ctrlKey: true,
        shiftKey: true,
        callback: () => setIsNewPlanModalOpen(true),
        // disable shortcuts when app is disabled
        disabled: disableApp,
      },
      // to add a new shortcut, add it to this array, following the same structure
      // as the one above
    ],
    // by default disabled on landing + login pages
    disabledRoutes: ["/", "/login"],
  });

  return <>{children}</>;
};
