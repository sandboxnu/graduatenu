import { EditIcon } from "@chakra-ui/icons";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { API } from "@graduate/api-client";
import { PlanModel, UpdatePlanDto } from "@graduate/common";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSWRConfig } from "swr";
import { USE_STUDENT_WITH_PLANS_SWR_KEY } from "../../hooks";
import { handleApiClientError } from "../../utils";
import { toast } from "../../utils";
import { BlueButton } from "../Button";
import { PlanInput, PlanSelect } from "../Form";

type EditPlanModalProps = {
  plan: PlanModel<string>;
};

type EditPlanInput = {
  name: string;
  major: string;
  catalogYear: number;
};

// Mock supported majors till we have scraped and stored majors
const SUPPORTED_MAJORS = new Map<number, string[]>([
  [
    2019,
    ["Computer Science, BSCS", "Computer Science and Cognitive Psycology, BS"],
  ],
  [2020, ["Computer Science, BSCS"]],
]);

export const EditPlanModal: React.FC<EditPlanModalProps> = ({ plan }) => {
  const { mutate } = useSWRConfig();
  const router = useRouter();
  const { onOpen, onClose, isOpen } = useDisclosure();
  const {
    register,
    handleSubmit,
    formState: { isDirty, errors, isSubmitting },
    watch,
    reset,
  } = useForm<EditPlanInput>({
    mode: "onTouched",
    shouldFocusError: true,
  });

  useEffect(() => {
    // Change the default field to the corresponding plan when a plan is selected/edited
    reset({
      name: plan.name,
      catalogYear: plan.catalogYear,
      major: plan.major,
    });
  }, [plan, reset]);

  const catalogYear = watch("catalogYear");

  const onSubmitHandler = async (payload: UpdatePlanDto) => {
    // If no field has been changed, don't send an update request
    if (!isDirty) return;

    try {
      await API.plans.update(plan.id, payload);
    } catch (error) {
      handleApiClientError(error as Error, router);
      return;
    }

    mutate(USE_STUDENT_WITH_PLANS_SWR_KEY);
    toast.success("Plan updated successfully.");
  };

  return (
    <>
      <BlueButton leftIcon={<EditIcon />} onClick={onOpen} ml="xs" size="md">
        Edit Plan
      </BlueButton>

      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmitHandler)}>
            <ModalCloseButton />
            <ModalHeader color="primary.red.main" fontSize="2xl">
              Edit Plan
            </ModalHeader>
            <ModalBody>
              <VStack spacing={"sm"}>
                <PlanInput
                  error={errors.name}
                  label={"Title"}
                  type={"text"}
                  id="name"
                  placeholder="My Plan"
                  {...register("name", {
                    required: "Title is required",
                  })}
                />

                <PlanSelect
                  label={"Catalog Year"}
                  id="catalogYear"
                  placeholder="Select a Catalog Year"
                  error={errors.catalogYear}
                  array={Array.from(SUPPORTED_MAJORS.keys())}
                  {...register("catalogYear", {
                    required: "Catalog year is required",
                    valueAsNumber: true,
                  })}
                />

                <PlanSelect
                  label={"Major"}
                  id="major"
                  placeholder="Select a Major"
                  error={errors.major}
                  array={SUPPORTED_MAJORS.get(catalogYear) ?? []}
                  {...register("major", {
                    required: "Major is required",
                  })}
                />
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button isLoading={isSubmitting} type="submit" ml="auto">
                Save
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};
