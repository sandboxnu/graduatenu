import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useMemo,
} from "react";
import { WhatsNewModal } from "./WhatsNewModal";
import Cookies from "universal-cookie";
import { Spring2025ReleaseModalContent } from "./Spring2025ReleaseModalContent";

const WhatsNewModalContext = createContext<{ openModal: () => void }>({
  openModal: () => {
    console.warn("openModal is called without a context provider.");
  },
});

export const WhatsNewModalContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => {
    setIsOpen(true);
  };
  const cookies = useMemo(() => new Cookies(), []);

  useEffect(() => {
    const existingToken = cookies.get("WhatsNewModal JWT");

    if (!existingToken) {
      setIsOpen(true); // Open modal only if token doesn't exist
    }
  }, [cookies]);

  const handleClose = () => {
    setIsOpen(false); // Close the modal when user dismisses it
    const newToken = "alreadyShowedModal";
    cookies.set("WhatsNewModal JWT", newToken, { path: "/" }); // Set the token when user closes the modal
  };

  return (
    <WhatsNewModalContext.Provider value={{ openModal }}>
      {children}
      <WhatsNewModal isOpen={isOpen} onClose={handleClose}>
        <Spring2025ReleaseModalContent onClose={handleClose} />
      </WhatsNewModal>
    </WhatsNewModalContext.Provider>
  );
};

export const useWhatsNewModal = () => useContext(WhatsNewModalContext);
