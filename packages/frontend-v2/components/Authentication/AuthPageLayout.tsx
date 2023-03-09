import { Flex, Grid, GridItem, Image } from "@chakra-ui/react";
import { ReactNode } from "react";
import { GraduatePreAuthHeader } from "../Header";

interface AuthenticationPageLayoutProps {
  form: ReactNode;
}
export const AuthenticationPageLayout: React.FC<
  AuthenticationPageLayoutProps
> = ({ form }) => {
  return (
    <Flex direction="column" height="100vh">
      <GraduatePreAuthHeader />
      <Grid templateColumns="repeat(8, 1fr)" templateRows="1fr" flexGrow={1}>
        <GridItem colSpan={3}>{form}</GridItem>
        <GridItem
          colSpan={5}
          backgroundColor="neutral.main"
          position="relative"
        >
          <Image
            src="/app_snippet.png"
            alt="GraduateNU app snippet"
            width="85%"
            height="80%"
            position="absolute"
            right="0px"
            bottom="0px"
            objectFit="cover"
            objectPosition="0 100%"
            borderLeft="3px solid black"
            borderTop="3px solid black"
            borderRadius="12px 0px 0px 0px"
          />
        </GridItem>
      </Grid>
    </Flex>
  );
};
