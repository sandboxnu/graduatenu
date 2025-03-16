import { UpDownIcon } from "@chakra-ui/icons";
import { Box, Flex, Link, Text, Tooltip } from "@chakra-ui/react";
import { API } from "@graduate/api-client";
import { Maybe } from "@graduate/common";
import { useState } from "react";
import useSWR from "swr";

/** A clickable dev widget for the header at the top of all pages. */
export const MetaInfoWidget: React.FC = () => {
  const [showDevInfo, setShowDevInfo] = useState(false);

  return (
    <Flex position="relative">
      <Flex
        border={
          process.env.NODE_ENV === "development" ? "1px solid" : "0px solid"
        }
        _hover={{
          background: "neutral.100",
        }}
        borderColor="neutral.300"
        padding="5px"
        alignItems="center"
        gap="xs"
        borderRadius="md"
        onClick={() => setShowDevInfo((state) => !state)}
        transition="background 0.15s ease"
        userSelect="none"
      >
        <UpDownIcon transform="rotate(90deg)" />
        {process.env.NODE_ENV === "development" && <Text>Dev</Text>}
      </Flex>
      {
        <Box
          position="absolute"
          border="1px solid"
          borderColor="neutral.400"
          top="80%"
          left="0px"
          transition="opacity 0.15s ease, transform 0.15s ease"
          opacity={showDevInfo ? 1 : 0}
          transform={showDevInfo ? "scale(1)" : "scale(0.9) translateY(-5px)"}
          pointerEvents={showDevInfo ? "unset" : "none"}
          transformOrigin="20% top"
          padding="md"
          background="white"
          borderRadius="md"
          width="300px"
          zIndex={1}
        >
          <MetaInfo />
        </Box>
      }
    </Flex>
  );
};

/** The contents of the meta info widget which displays docker build info. */
export const MetaInfo: React.FC = () => {
  const { data, error } = useSWR("/meta/info", API.meta.getInfo);

  // When we update Next versions we can use an instrumentation.ts file to create this information
  // const relativeRunTime = timeDifference(Date.now(), Number(process.env.NEXT_PUBLIC_NEXT_RUN_TIMESTAMP ?? 0) * 1000)

  return (
    <>
      <Text fontWeight="bold" marginBottom="xs">
        Docker Build Info
      </Text>
      <Text fontWeight="bold">Vercel Frontend</Text>
      <MetaInfoSection
        environment={process.env.NODE_ENV ?? false}
        commitHash={process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ?? false}
        commitMessage={
          process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_MESSAGE ?? false
        }
      />

      <Text fontWeight="bold" marginTop="xs">
        Backend
      </Text>
      {error && <Text color="red.500">Error Reaching Backend</Text>}
      {data !== undefined ? (
        <MetaInfoSection
          environment={data.environment}
          commitHash={data.commit}
          commitMessage={data.commitMessage}
        />
      ) : (
        !error && <Text>Loading Backend Info...</Text>
      )}
    </>
  );
};

/** Display the given optional commit hash and message. */
const CommitText: React.FC<{
  commitHash: Maybe<string>;
  commitMessage: Maybe<string>;
}> = ({ commitHash, commitMessage }) => {
  if (commitHash !== false) {
    const shortHash = commitHash.slice(0, 7);
    const commitLink = `https://github.com/sandboxnu/graduatenu/commit/${commitHash}`;
    return (
      <Text>
        Commit:{" "}
        <Tooltip label={commitHash}>
          <Link href={commitLink} color="blue.500" target="_blank">
            {`${
              commitMessage !== false ? commitMessage : "<missing message>"
            } (${shortHash})`}
          </Link>
        </Tooltip>
      </Text>
    );
  } else {
    return <Text>Commit: {"<missing commit hash>"}</Text>;
  }
};

/** A Docker meta info section. */
export const MetaInfoSection: React.FC<{
  environment: Maybe<string>;
  commitHash: Maybe<string>;
  commitMessage: Maybe<string>;
}> = ({ environment, commitHash, commitMessage }) => {
  return (
    <>
      <Text>
        Environment: {environment !== false ? environment : "<unknown env>"}
      </Text>
      <CommitText commitHash={commitHash} commitMessage={commitMessage} />
    </>
  );
};
