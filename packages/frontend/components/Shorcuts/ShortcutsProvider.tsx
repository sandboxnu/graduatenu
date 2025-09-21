import React, { useContext } from "react";
import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts";
import { useWindowSize } from "../../hooks";
import { NewPlanModalContext } from "../../pages/_app";

interface ShortcutsProviderProps {
  children?: React.ReactNode;
}

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
      // we can add more shorcuts here in the future
    ],
    // by default disabled on landing + login pages
    disabledRoutes: ["/", "/login"],
  });

  return <>{children}</>;
};
