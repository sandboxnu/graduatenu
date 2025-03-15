import { UpDownIcon } from "@chakra-ui/icons";
import { Box, Flex, Link, Text, Tooltip } from "@chakra-ui/react";
import { API } from "@graduate/api-client";
import { Maybe } from "@graduate/common";
import { useState } from "react";
import useSWR from "swr";

// adapted from https://stackoverflow.com/questions/3177836/how-to-format-time-since-xxx-e-g-4-minutes-ago-similar-to-stack-exchange-site
/**
 * @param   current  The current time as a JS timestamp (milliseconds)
 * @param   previous The previous time as a JS timestamp (milliseconds)
 * @returns          Textual relative time difference
 */
function timeDifference(current: number, previous: number): string {
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerMonth = msPerDay * 30;
  const msPerYear = msPerDay * 365;

  const elapsed = current - previous;

  if (elapsed < msPerMinute) {
    return Math.round(elapsed / 1000) + " second(s) ago";
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + " minute(s) ago";
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + " hour(s) ago";
  } else if (elapsed < msPerMonth) {
    return "~" + Math.round(elapsed / msPerDay) + " day(s) ago";
  } else if (elapsed < msPerYear) {
    return "~" + Math.round(elapsed / msPerMonth) + " month(s) ago";
  } else {
    return "~" + Math.round(elapsed / msPerYear) + " year(s) ago";
  }
}

/**
 * @param   timestamp A JS timestamp (milliseconds)
 * @returns           Formats the given timestamp as a string time
 */
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
      <Text fontWeight="bold">Frontend</Text>
      <MetaInfoSection
        environment={process.env.NODE_ENV ?? false}
        buildTime={process.env.NEXT_PUBLIC_BUILD_TIMESTAMP ?? false}
        commitHash={process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF ?? false}
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

/** Displays the given optional build time timestamp. */
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

/** A Docker meta info section. */
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
