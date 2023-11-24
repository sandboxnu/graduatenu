import { Link, Text, Tooltip } from "@chakra-ui/react";
import { API } from "@graduate/api-client";
import { Maybe } from "@graduate/common";
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
