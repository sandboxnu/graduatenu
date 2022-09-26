import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
} from "@chakra-ui/react";
import { API } from "@graduate/api-client";
import { CreatePlanDtoWithoutSchedule } from "@graduate/common";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useSWRConfig } from "swr";
import { USE_STUDENT_WITH_PLANS_SWR_KEY } from "../../hooks";
import { createEmptySchedule, handleApiClientError } from "../../utils";

interface AddPlanModalProps {
  isOpen: boolean;
  onClose: (newPlanId?: number) => void;
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
  isOpen,
  onClose,
}) => {
  const { mutate } = useSWRConfig();
  const router = useRouter();
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
    console.log(schedule);
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
    resetFormAndCloseModal(createdPlanId);
  };

  const resetFormAndCloseModal = (createdPlanId?: number) => {
    reset();
    onClose(createdPlanId);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => resetFormAndCloseModal()} size="md">
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmitHandler)}>
            <ModalCloseButton />
            <ModalHeader color="primary.red.main" fontSize="2xl">
              New Plan
            </ModalHeader>
            <ModalBody>
              <FormControl isInvalid={errors.name != null} mb="sm">
                <AddPlanLabel label="Title" />
                <Input
                  type="text"
                  id="name"
                  placeholder="My Plan"
                  {...register("name", {
                    required: "Title is required",
                  })}
                />
                <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.catalogYear != null} mb="sm">
                <AddPlanLabel label="Catalog Year" />
                <Select
                  id="catalogYear"
                  placeholder="Select a Catalog Year "
                  {...register("catalogYear", {
                    required: "Catalog year is required",
                    valueAsNumber: true,
                  })}
                >
                  {Array.from(SUPPORTED_MAJORS.keys()).map((catalogYear) => (
                    <option key={catalogYear} value={catalogYear}>
                      {catalogYear}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>
                  {errors.catalogYear?.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.catalogYear != null}>
                <AddPlanLabel label="Major" />
                <Select
                  id="major"
                  placeholder="Select a Major"
                  {...register("major", {
                    required: "Major is required",
                  })}
                >
                  {(SUPPORTED_MAJORS.get(catalogYear) ?? []).map((major) => (
                    <option key={major} value={major}>
                      {major}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>{errors.major?.message}</FormErrorMessage>
              </FormControl>
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

interface AddPlanLabelProps {
  label: string;
}

const AddPlanLabel: React.FC<AddPlanLabelProps> = ({ label }) => {
  return (
    <FormLabel color="primary.red.main" size="md" fontWeight="medium" mb="2xs">
      {label}
    </FormLabel>
  );
};
