import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Box, IconButton, ModalBody, Text } from "@chakra-ui/react";
import { useState } from "react";

interface ModalBodyPaginationProps {
  pages: React.ReactNode[];
}

export const ModalBodyPagination: React.FC<ModalBodyPaginationProps> = ({
  pages,
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const totalPages = pages.length;

  function goToNextPage() {
    setCurrentPageIndex((prev) => Math.min(prev + 1, totalPages));
  }

  function goToPreviousPage() {
    setCurrentPageIndex((prev) => Math.max(prev - 1, 0));
  }

  function setCurrentPage(index: number) {
    setCurrentPageIndex(index);
  }

  return (
    <ModalBody justifyContent="center" alignContent="center">
      {pages[currentPageIndex]}
      <Pagination
        goToPreviousPage={goToPreviousPage}
        goToNextPage={goToNextPage}
        currentPageIndex={currentPageIndex}
        totalPages={totalPages}
      />
    </ModalBody>
  );
};

interface PaginationProps {
  goToPreviousPage: () => void;
  goToNextPage: () => void;
  currentPageIndex: number;
  totalPages: number;
}

const Pagination: React.FC<PaginationProps> = ({
  goToPreviousPage,
  goToNextPage,
  currentPageIndex,
  totalPages,
}) => {
  return (
    <Box display="flex" alignItems="center" justifyContent="center">
      <IconButton
        colorScheme="primary.blue.light.main"
        variant="ghost"
        icon={<ChevronLeftIcon />}
        onClick={goToPreviousPage}
        isDisabled={currentPageIndex === 0}
        aria-label="Previous page"
      />
      <Text textColor="primary.blue.light.main">
        {currentPageIndex + 1} / {totalPages}
      </Text>
      <IconButton
        colorScheme="primary.blue.light.main"
        variant="ghost"
        icon={<ChevronRightIcon />}
        onClick={goToNextPage}
        isDisabled={currentPageIndex >= totalPages - 1}
        aria-label="Next page"
      />
    </Box>
  );
};
