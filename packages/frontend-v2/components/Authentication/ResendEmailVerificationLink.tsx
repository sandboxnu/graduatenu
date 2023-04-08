import { API } from "@graduate/api-client";
import { handleApiClientError, toast } from "../../utils";
import { useRouter } from "next/router";
import axios from "axios";
import { emailAlreadyConfirmed, unableToSendEmail } from "@graduate/common";
import { Link } from "@chakra-ui/react";

interface ResendEmailVerificationLinkProps {
  label: string;
}

export const ResendEmailVerificationLink: React.FC<
  ResendEmailVerificationLinkProps
> = ({ label }) => {
  const router = useRouter();
  const handleResendConfirmationEmail = async () => {
    try {
      await API.email.resendConfirmationLink();
      toast.success("Successfully resent email!");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorMessage = err.response?.data?.message;
        if (errorMessage === emailAlreadyConfirmed) {
          router.push("home");
          toast.info("Your email has already been verfied!");
          return;
        }

        if (errorMessage === unableToSendEmail) {
          toast.error(
            "Something went wrong and we couldn't send you a new confirmation email. Try again in a some time."
          );
          return;
        }
      }
      handleApiClientError(err as Error, router);
    }
  };

  return (
    <Link
      onClick={handleResendConfirmationEmail}
      color="primary.blue.light.main"
      fontWeight="bold"
      fontSize="sm"
    >
      {label}
    </Link>
  );
};
