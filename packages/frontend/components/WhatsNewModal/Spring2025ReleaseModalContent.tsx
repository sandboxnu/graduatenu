import { InfoOutlineIcon } from "@chakra-ui/icons";
import {
  Stack,
  chakra,
  ModalContentProps,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Button,
  Text,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { ModalBodyPagination } from "./ModalBodyPagination";
import { FeaturePageData, NewFeaturePage } from "./WhatsNewModal";

const featurePagesData: FeaturePageData[] = [
  {
    key: "minor-degree-support",
    title: "Minor Degree Support",
    descriptionSection: (
      <Stack>
        <Text>We now support minor degrees!</Text>
        <Text>
          To add a minor to a
          <Text as="span" fontWeight="bold">
            new
          </Text>
          plan, select one under the new “Minor” drop-down menu in the “Add
          Plan” modal.
        </Text>
        <Text>
          To add a minor to an
          <Text as="span" fontWeight="bold">
            existing
          </Text>
          plan, select one under the new “Minor” drop-down menu in the “Add
          Plan” modal.
        </Text>
      </Stack>
    ),
    image: InProgressIndicatorImage.src,
  },
  {
    key: "undecided-concentration-support",
    title: "Undecided Concentrations",
    descriptionSection: (
      <Stack>
        <Text>Unsure of which concentration to pursue?</Text>
        <Text>
          You can now select “Undecided” under the “Concentration” drop-down
          when creating and editing plans.
        </Text>
        <Text>
          On your dashboard, your left side-bar will populate with all
          applicable concentrations. Test out classes before committing to a
          concentration.
        </Text>
      </Stack>
    ),
    image: CoursesAddedToPlanImage.src,
  },
  {
    key: "add-course-modal-upgrade",
    title: "“Add Course” Modal Upgrades",
    descriptionSection: (
      <Stack>
        <Text>Have you had trouble adding co-requisites?</Text>
        <Text>
          You can now add classes
          <Text as="span" fontWeight="bold">
            and
          </Text>
          their co-reqs in one step. Our upgraded class blocks tile classes
          together with their co-requisites (labs, recitations, etc.)
        </Text>
      </Stack>
    ),
    image: SearchNEUIntegrationImage.src,
  },
  {
    key: "template-plans",
    title: "Template Plans",
    descriptionSection: (
      <Stack>
        <Text>Want to get a head-start on planning?</Text>
        <Text>
          You can now select a “Template Plan” when creating a new plan.
        </Text>
        <Text>
          Sourced from Northeastern’s Academic Catalog, all recommended courses
          will populate under each year upon plan creation.
        </Text>
      </Stack>
    ),
    image: GeneralPlaceholdersImage.src,
  },
  {
    key: "2024-beta-majors",
    title: "Support for 2024-2025 Academic Catalog [BETA]",
    descriptionSection: (
      <Stack>
        <Text>
          We have added support for the undergraduate catalog of the 2024-2025
          academic year.
        </Text>
        <Text>
          You can now create plans that align with the new requirements for the
          2024-2025 academic year.
        </Text>
      </Stack>
    ),
    image: BetaMajorsImage.src,
  },
];

export const Fall2024ReleaseModalContent: React.FC<ModalContentProps> = ({
  onClose,
}) => {
  const [featurePages, setFeaturePages] = React.useState<React.ReactNode[]>([]);

  useEffect(() => {
    const pages = [];
    for (const featurePageData of featurePagesData) {
      pages.push(<NewFeaturePage {...featurePageData} />);
    }
    setFeaturePages(pages);
  }, []);

  return (
    <ModalContent>
      <ModalHeader
        color="primary.blue.dark.main"
        borderBottom="1px"
        borderColor="neutral.200"
      >
        <Text>Latest Release: Fall 2024</Text>
      </ModalHeader>
      {featurePages.length > 0 && <ModalBodyPagination pages={featurePages} />}
      <ModalFooter alignContent="center" justifyContent="center">
        <Button
          variant="solid"
          borderRadius="md"
          width="sm"
          colorScheme="red"
          onClick={onClose}
        >
          Looks Good!
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};
