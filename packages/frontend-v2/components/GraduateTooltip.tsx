import { ComponentWithAs, Tooltip, TooltipProps } from "@chakra-ui/react";

/**
 * Note: This should ideally be a customized component in the theme file.
 * Couldn't get it to work for some reason though.
 */
export const GraduateToolTip: ComponentWithAs<"div", TooltipProps> = ({
  ...rest
}) => {
  return (
    <Tooltip
      hasArrow
      fontSize="xs"
      backgroundColor="#2F3747"
      color="white"
      borderRadius="sm"
      shadow="lg"
      {...rest}
    />
  );
};
