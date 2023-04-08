import { QuestionOutlineIcon } from "@chakra-ui/icons";
import { ReactNode } from "react";
import { GraduateToolTip } from "../GraduateTooltip";

interface HelperToolTipProps {
  label: ReactNode;
}

export const HelperToolTip: React.FC<HelperToolTipProps> = ({ label }) => {
  return (
    <GraduateToolTip label={label} placement="top">
      <QuestionOutlineIcon color="primary.blue.dark.main" />
    </GraduateToolTip>
  );
};
