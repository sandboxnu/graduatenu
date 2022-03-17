import React, { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { WhiteColorButton } from "./ColoredButtons";
import { PrimaryButton, SecondaryButton } from "./PrimaryButton";

type LinkButtonVariant = "primary" | "secondary" | "white";

type LinkButtonPropsWithoutVariant = Omit<LinkButtonProps, "variant">;

/**
 * React router link that looks like a primary button.
 */
export const PrimaryLinkButton: React.FC<LinkButtonPropsWithoutVariant> = ({
  children,
  ...linkButtonProps
}) => {
  return (
    <LinkButton variant="primary" {...linkButtonProps}>
      {children}
    </LinkButton>
  );
};

/**
 * React router link that looks like a secondary button.
 */
export const SecondaryLinkButton: React.FC<LinkButtonPropsWithoutVariant> = ({
  children,
  ...linkButtonProps
}) => {
  return (
    <LinkButton variant="secondary" {...linkButtonProps}>
      {children}
    </LinkButton>
  );
};

/**
 * React router link that looks like a white button.
 */
export const WhiteLinkButton: React.FC<LinkButtonPropsWithoutVariant> = ({
  children,
  ...linkButtonProps
}) => {
  return (
    <LinkButton variant="white" {...linkButtonProps}>
      {children}
    </LinkButton>
  );
};

type LinkButtonProps = {
  to: string;
  variant: LinkButtonVariant;
  style?: CSSProperties;
};

const LinkButton: React.FC<LinkButtonProps> = ({
  to,
  variant,
  style,
  children,
}) => {
  const linkStyles = {
    textDecoration: "none",
    ...style,
  };

  let styledButton = <PrimaryButton>{children}</PrimaryButton>;

  if (variant === "secondary") {
    styledButton = <SecondaryButton>{children}</SecondaryButton>;
  } else if (variant === "white") {
    styledButton = <WhiteColorButton>{children}</WhiteColorButton>;
  }

  return (
    <Link to={to} style={linkStyles}>
      {styledButton}
    </Link>
  );
};
