import { ComponentStyleConfig } from "@chakra-ui/react";

export const Button: ComponentStyleConfig = {
  // base button styles
  baseStyle: {
    borderRadius: 'base',
  },
  sizes: { // create custom button sizes, can be extended either in either direction
    sm: {
      fontSize: 'sm',
      px: 4,
      py: 3,
    },
    md: {
      fontSize: 'md',
      px: 6,
      py: 4,
    },
  },
  variants: { // can create new button variants here
    outline: {
      border: '2px solid',
      borderColor: 'primary.main',
      color: 'primary.main',
      colorScheme: 'primary',
    },

    solid: {
      bg: 'primary.main',
      color: 'white',
    },
  },
  // default size and variant values
  defaultProps: {
    size: 'md',
    variant: 'outline',
    colorScheme: 'primary',
  },
}