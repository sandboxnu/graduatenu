import { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Box, Divider, Flex, Heading, Spinner } from "@chakra-ui/react";
import { PlanModel } from "@graduate/common";
import {
  Plan,
  GraduatePreAuthHeader,
  NoPlanSidebar,
  Sidebar,
  NoMajorSidebar,
  GraduatePostAuthHeader,
} from "../../components";
import { IsGuestContext } from "../_app";

const SharePlanPage: NextPage = () => {
  const router = useRouter();
  const { code } = router.query;
  const [plan, setPlan] = useState<PlanModel<string> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isGuest } = useContext(IsGuestContext);

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

  let renderedSidebar = <NoPlanSidebar />;
  if (plan) {
    if (plan.major) {
      renderedSidebar = (
        <Sidebar
          selectedPlan={plan}
          transferCourses={plan.student?.coursesTransfered || []}
          isSharedPlan={true}
        />
      );
    } else
      renderedSidebar = (
        <NoMajorSidebar
          selectedPlan={plan}
          transferCourses={plan.student?.coursesTransfered || []}
          isSharedPlan={true}
        />
      );
  }

  return (
    <Flex flexDirection="column" height="100vh" overflow="hidden">
      {isGuest ? <GraduatePreAuthHeader /> : <GraduatePostAuthHeader />}
      <Heading size="lg" m="7px">
        {`Viewing '${plan?.name}'`}
      </Heading>
      <Flex height="100%" overflow="hidden">
        <Box
          bg="neutral.100"
          overflowY="auto"
          width={{ desktop: "360px", tablet: "300px" }}
          flexShrink={0}
        >
          {renderedSidebar}
        </Box>

        <Box p="md" overflow="auto" flexGrow={1}>
          <Flex flexDirection="column" rowGap="sm">
            {plan && (
              <>
                <Plan
                  plan={plan}
                  mutateStudentWithUpdatedPlan={() => {}}
                  isSharedPlan={true}
                />
                <Divider borderColor="neutral.200" borderWidth={1} />
              </>
            )}
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
};

export default SharePlanPage;
