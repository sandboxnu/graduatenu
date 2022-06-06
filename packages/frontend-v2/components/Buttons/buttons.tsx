import { Button } from "@chakra-ui/react";

interface OutlineButtonProps {
  text: string;
  size: string;
}

export const PrimaryOutlineButton = ({ text, size }: OutlineButtonProps): JSX.Element => {
  return (
    <Button size={ size } color="primary.main" colorScheme="primary" variant="outline">
      { text }
    </Button> 
  );
}

