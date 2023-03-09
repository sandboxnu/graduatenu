import NextLink from "next/link";
import { Link as ChakraLink } from "@chakra-ui/react";

interface GraduateLinkProps {
  href: string;
  text: string;
}

export const GraduateLink: React.FC<GraduateLinkProps> = ({ href, text }) => {
  return (
    <NextLink href={href} passHref>
      <ChakraLink color="primary.blue.light.main" fontWeight="bold">
        {text}
      </ChakraLink>
    </NextLink>
  );
};
