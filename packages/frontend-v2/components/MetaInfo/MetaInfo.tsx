import { Box, Flex, Icon, Link, Text, Tooltip } from "@chakra-ui/react";
import { API } from "@graduate/api-client";
import { Maybe } from "@graduate/common";
import { useState } from "react";
import useSWR from "swr";

function timeDifference(current: number, previous: number): string {
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerMonth = msPerDay * 30;
  const msPerYear = msPerDay * 365;

  const elapsed = current - previous;

  if (elapsed < msPerMinute) {
    return Math.round(elapsed / 1000) + " seconds ago";
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + " minutes ago";
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + " hours ago";
  } else if (elapsed < msPerMonth) {
    return "~" + Math.round(elapsed / msPerDay) + " days ago";
  } else if (elapsed < msPerYear) {
    return "~" + Math.round(elapsed / msPerMonth) + " months ago";
  } else {
    return "~" + Math.round(elapsed / msPerYear) + " years ago";
  }
}

function formatBuildTime(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
}

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
        <Icon
          xmlns="http://www.w3.org/2000/svg"
          fill="black"
          viewBox="0 0 24 24"
        >
          <path d="M14.6,16.6L19.2,12L14.6,7.4L16,6L22,12L16,18L14.6,16.6M9.4,16.6L4.8,12L9.4,7.4L8,6L2,12L8,18L9.4,16.6Z"></path>
        </Icon>
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
        >
          <MetaInfo />
        </Box>
      }
    </Flex>
  );
};

export const MetaInfo: React.FC = () => {
  const { data, error } = useSWR("/meta/info", API.meta.getInfo);

  // When we update Next versions we can use an instrumentation.ts file to create this information
  // const relativeRunTime = timeDifference(Date.now(), Number(process.env.NEXT_PUBLIC_NEXT_RUN_TIMESTAMP ?? 0) * 1000)

  return (
    <>
      <Text fontWeight="bold" marginBottom="xs">
        Docker Build Info
      </Text>
      <Text fontWeight="bold">Frontend</Text>
      <MetaInfoSection
        environment={process.env.NODE_ENV ?? false}
        buildTime={process.env.NEXT_PUBLIC_BUILD_TIMESTAMP ?? false}
        commitHash={process.env.NEXT_PUBLIC_COMMIT_HASH ?? false}
        commitMessage={process.env.NEXT_PUBLIC_COMMIT_MESSAGE ?? false}
      />

      <Text fontWeight="bold" marginTop="xs">
        Backend
      </Text>
      {error && <Text color="red.500">Error Reaching Backend</Text>}
      {data !== undefined ? (
        <MetaInfoSection
          environment={data.environment}
          buildTime={data.build_timestamp}
          commitHash={data.commit}
          commitMessage={data.commitMessage}
        />
      ) : (
        !error && <Text>Loading Backend Info...</Text>
      )}
    </>
  );
};

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

const BuildTime: React.FC<{ buildTime: Maybe<string | number> }> = ({
  buildTime,
}) => {
  if (buildTime !== false) {
    const numericTime = Number(buildTime) * 1000;
    return (
      <Tooltip label={formatBuildTime(numericTime)}>
        <Text>Image Built: {timeDifference(Date.now(), numericTime)}</Text>
      </Tooltip>
    );
  } else {
    return <Text>Built: {"<missing build time>"}</Text>;
  }
};

export const MetaInfoSection: React.FC<{
  environment: Maybe<string>;
  commitHash: Maybe<string>;
  buildTime: Maybe<string> | Maybe<number>;
  commitMessage: Maybe<string>;
}> = ({ environment, commitHash, buildTime, commitMessage }) => {
  return (
    <>
      <Text>
        Environment: {environment !== false ? environment : "<unknown env>"}
      </Text>
      <CommitText commitHash={commitHash} commitMessage={commitMessage} />
      <BuildTime buildTime={buildTime} />
    </>
  );
};
