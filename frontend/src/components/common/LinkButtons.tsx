import React, { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { PrimaryButton, SecondaryButton } from "./PrimaryButton";

type LinkButtonPropsWithoutVariant = Omit<LinkButtonProps, "isPrimary">;

/**
 * React router link that looks like a primary button.
 */
export const PrimaryLinkButton: React.FC<LinkButtonPropsWithoutVariant> = ({
  children,
  ...linkButtonProps
}) => {
  return (
    <LinkButton {...linkButtonProps} isPrimary>
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
  return <LinkButton {...linkButtonProps}>{children}</LinkButton>;
};

type LinkButtonProps = {
  to: string;
  isPrimary?: boolean;
  style?: CSSProperties;
};

const LinkButton: React.FC<LinkButtonProps> = ({
  to,
  isPrimary,
  style,
  children,
}) => {
  const linkStyles = {
    textDecoration: "none",
    ...style,
  };

  return (
    <Link to={to} style={linkStyles}>
      {isPrimary ? (
        <PrimaryButton>{children}</PrimaryButton>
      ) : (
        <SecondaryButton>{children}</SecondaryButton>
      )}
    </Link>
  );
};
