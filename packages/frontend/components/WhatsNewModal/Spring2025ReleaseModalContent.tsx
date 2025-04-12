import {
  Stack,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Button,
  Text,
  Link,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { ModalBodyPagination } from "./ModalBodyPagination";
import {
  FeaturePageData,
  NewFeaturePage,
  WhatsNewModalContentProps,
} from "./WhatsNewModal";
import MinorDegreeSupportImage from "../../public/new-features-spring-2025/minor-degree-support.png";
import UndecidedConcentrationImage from "../../public/new-features-spring-2025/undecided-concentration.png";
import AddCourseModalUpgradeImage from "../../public/new-features-spring-2025/add-course-modal-upgrades.png";
import TemplatePlansImage from "../../public/new-features-spring-2025/template-plans.png";

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
            {" "}
            new{" "}
          </Text>
          plan, select one under the new “Minor” drop-down menu in the “Add
          Plan” modal.
        </Text>
        <Text>
          To add a minor to an
          <Text as="span" fontWeight="bold">
            {" "}
            existing{" "}
          </Text>
          plan, select one under the new “Minor” drop-down menu in the “Add
          Plan” modal.
        </Text>
      </Stack>
    ),
    image: MinorDegreeSupportImage.src,
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
    image: UndecidedConcentrationImage.src,
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
            {" "}
            and{" "}
          </Text>
          their co-reqs in one step. Our upgraded class blocks tile classes
          together with their co-requisites (labs, recitations, etc.)
        </Text>
      </Stack>
    ),
    image: AddCourseModalUpgradeImage.src,
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

        <Text fontWeight="bold">Image Source</Text>
        <Link>
          <Text wordBreak="break-word">
            https://catalog.northeastern.edu/undergraduate/computer-information-science
          </Text>
        </Link>
      </Stack>
    ),
    image: TemplatePlansImage.src,
  },
];

export const Spring2025ReleaseModalContent: React.FC<
  WhatsNewModalContentProps
> = ({ onClose }) => {
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
        <Text>Latest Release: Spring 2025</Text>
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
