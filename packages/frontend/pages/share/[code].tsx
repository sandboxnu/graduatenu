import { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Box, Divider, Flex, Heading, Spinner } from "@chakra-ui/react";
import { CreatePlanDto, PlanModel } from "@graduate/common";
import { API } from "@graduate/api-client";
import { toast } from "react-toastify";
import { mutate } from "swr";
import {
  Plan,
  GraduatePreAuthHeader,
  NoPlanSidebar,
  Sidebar,
  NoMajorSidebar,
  GraduatePostAuthHeader,
  PlanDropdown,
  BlueButton,
} from "../../components";
import { IsGuestContext } from "../_app";
import {
  cleanDndIdsFromPlan,
  cleanDndIdsFromStudent,
  handleApiClientError,
} from "../../utils";
import {
  USE_STUDENT_WITH_PLANS_SWR_KEY,
  useStudentWithPlans,
} from "../../hooks";
import { GraduateToolTip } from "../../components/GraduateTooltip";
import { CopyIcon } from "@chakra-ui/icons";

const SharePlanPage: NextPage = () => {
  const router = useRouter();
  const { code } = router.query;
  const [plan, setPlan] = useState<PlanModel<string> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { isGuest } = useContext(IsGuestContext);
  const { student } = useStudentWithPlans();

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

  const handleSavePlan = async () => {
    if (!plan || !student) return;

    setSaving(true);

    const planToSave: CreatePlanDto = {
      name: "Copy of " + plan.name,
      catalogYear: plan.catalogYear,
      major: plan.major,
      concentration: plan.concentration,
      minor: plan.minor,
      schedule: cleanDndIdsFromPlan(plan).schedule,
    };

    let createdPlanId: number;
    if (isGuest) {
      createdPlanId = student.plans.length + 1;
      const planInLocalStorage: PlanModel<null> = {
        ...planToSave,
        id: createdPlanId,
        student: cleanDndIdsFromStudent(student),
        createdAt: new Date(),
        updatedAt: new Date(),
      } as PlanModel<null>;

      try {
        const currentStudentData = JSON.parse(
          window.localStorage.getItem("student") || "{}"
        );
        window.localStorage.setItem(
          "student",
          JSON.stringify({
            ...currentStudentData,
            plans: [...student.plans, planInLocalStorage],
          })
        );
      } catch (error) {
        toast.error("Failed to save plan");
        setSaving(false);
        return;
      }
    } else {
      try {
        const createdPlan = await API.plans.create(planToSave);
        createdPlanId = createdPlan.id;
      } catch (error) {
        handleApiClientError(error as Error, router);
        setSaving(false);
        return;
      }
    }

    mutate(USE_STUDENT_WITH_PLANS_SWR_KEY);
    toast.success("Plan saved successfully!");

    router.push("/home");
  };

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
      <Flex alignItems="flex-start" m="8px">
        <Heading size="lg">{`Viewing '${plan?.name}'`}</Heading>

        {plan && student && (
          <GraduateToolTip
            label="Click here to save this plan to your account"
            shouldWrapChildren
          >
            <BlueButton
              onClick={handleSavePlan}
              leftIcon={<CopyIcon />}
              ml="10px"
              size="md"
            >
              Copy
            </BlueButton>
          </GraduateToolTip>
        )}
      </Flex>
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
