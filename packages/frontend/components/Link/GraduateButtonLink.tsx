import { Button, ButtonProps } from "@chakra-ui/react";
import NextLink from "next/link";

interface GraduateButtonLinkProps extends ButtonProps {
  href: string;
}

export const GraduateButtonLink: React.FC<GraduateButtonLinkProps> = ({
  href,
  children,
  ...rest
}) => {
  return (
    <NextLink href={href} passHref>
      <Button size="sm" {...rest}>
        {children}
      </Button>
    </NextLink>
  );
};
