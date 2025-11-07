import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import { PlanModel } from "@graduate/common";
import { Plan, GraduatePreAuthHeader } from "../../components";
import { ClientSideError } from "../../components/Error/ClientSideError";

const SharePlanPage: NextPage = () => {
  const router = useRouter();
  const { code } = router.query;
  const [plan, setPlan] = useState<PlanModel<string> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code || typeof code !== "string") {
      return;
    }

    const fetchSharedPlan = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/plans/share/view/${code}`);

        if (!response.ok) {
          throw new Error("Failed to fetch shared plan");
        }

        const data = await response.json();
        setPlan(data.planJson);
      } catch (err: any) {
        setError(err.message || "Failed to load shared plan");
      } finally {
        setLoading(false);
      }
    };

    fetchSharedPlan();
  }, [code]);

  if (loading) {
    return (
      <Flex flexDirection="column" height="100vh" overflow="hidden">
        <GraduatePreAuthHeader />
        <Flex height="100%" justifyContent="center" alignItems="center">
          <Spinner size="xl" />
        </Flex>
      </Flex>
    );
  }

  if (error || !plan) {
    return <ClientSideError />;
  }

  return (
    <Flex flexDirection="column" height="100vh" overflow="hidden">
      <GraduatePreAuthHeader />
      <Flex height="100%" overflowY="auto" flexDirection="column" p="md">
        <Heading
          as="h1"
          fontSize="2xl"
          color="primary.blue.dark.main"
          fontWeight="bold"
          mb="5"
        >
          Viewing Plan '{plan.name}'
        </Heading>
        <Plan
          plan={plan}
          isSharedPlan={true}
          mutateStudentWithUpdatedPlan={() => {
            //no updates
          }}
        />
      </Flex>
    </Flex>
  );
};

export default SharePlanPage;
