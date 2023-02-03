import { ComponentWithAs, Tooltip, TooltipProps } from "@chakra-ui/react";

/**
 * Note: This should ideally be a customized component in the theme file.
 * Couldn't get it to work for some reason though.
 */
export const GraduateToolTip: ComponentWithAs<"div", TooltipProps> = ({
  children,
  ...rest
}) => {
  return (
    <Tooltip
      hasArrow
      fontSize="xs"
      backgroundColor="primary.blue.light.100"
      color="primary.blue.light.700"
      borderRadius="sm"
      {...rest}
    >
      {children}
    </Tooltip>
  );
};
