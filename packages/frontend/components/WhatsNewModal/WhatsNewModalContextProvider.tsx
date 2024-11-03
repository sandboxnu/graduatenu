import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { WhatsNewModal } from "./WhatsNewModal";
import { Fall2024ReleaseModalContent } from "./Fall2024ReleaseModalContent";
import Cookies from "universal-cookie";

const WhatsNewModalContext = createContext<{ openModal: () => void }>({
  openModal: () => {},
});

export const WhatsNewModalContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => {
    console.log("openModal");
    setIsOpen(true);
  };
  const cookies = new Cookies();

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
        <Fall2024ReleaseModalContent onClose={handleClose} />
      </WhatsNewModal>
    </WhatsNewModalContext.Provider>
  );
};

export const useWhatsNewModal = () => useContext(WhatsNewModalContext);
