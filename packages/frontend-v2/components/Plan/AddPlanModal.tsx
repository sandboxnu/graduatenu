import { AddIcon } from "@chakra-ui/icons";
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
import { CreatePlanDtoWithoutSchedule } from "@graduate/common";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { useSWRConfig } from "swr";
import { USE_STUDENT_WITH_PLANS_SWR_KEY } from "../../hooks";
import { createEmptySchedule, handleApiClientError } from "../../utils";
import { BlueButton } from "../Button";
import { PlanInput, PlanSelect } from "../Form";

interface AddPlanModalProps {
  setSelectedPlanId: Dispatch<SetStateAction<number | undefined | null>>;
}

// Mock supported majors till we have scraped and stored majors
const SUPPORTED_MAJORS = new Map<number, string[]>([
  [
    2019,
    ["Computer Science, BSCS", "Computer Science and Cognitive Psycology, BS"],
  ],
  [2020, ["Computer Science, BSCS"]],
]);

export const AddPlanModal: React.FC<AddPlanModalProps> = ({
  setSelectedPlanId,
}) => {
  const { mutate } = useSWRConfig();
  const router = useRouter();
  const { onOpen, onClose, isOpen } = useDisclosure();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm<CreatePlanDtoWithoutSchedule>({
    mode: "onTouched",
    shouldFocusError: true,
  });

  const catalogYear = watch("catalogYear");

  const onSubmitHandler = async (payload: CreatePlanDtoWithoutSchedule) => {
    const schedule = createEmptySchedule();
    const newPlan = {
      ...payload,
      schedule,
    };

    // create the new plan
    let createdPlanId: number;
    try {
      const createdPlan = await API.plans.create(newPlan);
      createdPlanId = createdPlan.id;
    } catch (error) {
      handleApiClientError(error as Error, router);

      // don't proceed further if POST failed
      return;
    }

    // refresh the cache and close the modal
    mutate(USE_STUDENT_WITH_PLANS_SWR_KEY);
    onCloseAddPlanModal(createdPlanId);
  };

  const onCloseAddPlanModal = (newPlanId?: number) => {
    reset();
    if (newPlanId) {
      setSelectedPlanId(newPlanId);
    }
    onClose();
  };

  return (
    <>
      <BlueButton leftIcon={<AddIcon />} onClick={onOpen} ml="xs" size="md">
        Add Plan
      </BlueButton>
      <Modal isOpen={isOpen} onClose={onCloseAddPlanModal} size="md">
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmitHandler)}>
            <ModalCloseButton />
            <ModalHeader color="primary.red.main" fontSize="2xl">
              New Plan
            </ModalHeader>
            <ModalBody>
              <VStack spacing={"sm"}>
                <PlanInput
                  label={"Title"}
                  id="name"
                  type={"text"}
                  placeholder="My Plan"
                  error={errors.name}
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
                Add Plan
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};