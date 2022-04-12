import "react-toastify/dist/ReactToastify.min.css";
import type { NextPage } from "next";
import { toast, logger } from "../utils";
import { useState } from "react";
import { ClientSideError } from "../components/Error/ClientSideError";

const Home: NextPage = () => {
  const [isClientSideError, setIsClientSideError] = useState(false);

  if (isClientSideError) {
    return <ClientSideError />;
  }

  return (
    <>
      <h1>GraduateNU Landing Page:</h1>
      <div>
        <h2>API Error Handling</h2>
        <div>
          <h3>Toasts without logging</h3>
          <button
            onClick={() =>
              toast.info("Oh btw here's some info on what you were doing")
            }
          >
            info
          </button>
          <button
            onClick={() =>
              toast.success("Whatever you were doing was successful")
            }
          >
            success
          </button>
          <button
            onClick={() =>
              toast.warn("Whatever you were doing was kinda successful")
            }
          >
            warning
          </button>
          <button
            onClick={() => toast.error("Whatever you were doing failed lol")}
          >
            error
          </button>
        </div>
      </div>
      <div>
        <h3>Toasts with logging</h3>
        <button
          onClick={() =>
            toast.info("Oh btw here's some info on what you were doing", {
              log: true,
            })
          }
        >
          info
        </button>
        <button
          onClick={() =>
            toast.success("Whatever you were doing was successful", {
              log: true,
            })
          }
        >
          success
        </button>
        <button
          onClick={() =>
            toast.warn("Whatever you were doing was kinda successful", {
              log: true,
            })
          }
        >
          warning
        </button>
        <button
          onClick={() =>
            toast.error("Whatever you were doing failed lol", { log: true })
          }
        >
          error
        </button>
      </div>
      <div>
        <h2>Client Side Error Handling</h2>
        <button
          onClick={() => {
            setIsClientSideError(true);
          }}
        >
          Trigger a client side error
        </button>
      </div>
      <div>
        <h2>Logging</h2>
        <button onClick={() => logger.info("Info log")}>info</button>
        <button onClick={() => logger.debug("Debug log")}>debug</button>
        <button onClick={() => logger.warn("Warning log")}>warning</button>
        <button onClick={() => logger.error("Error log")}>error</button>
      </div>
    </>
  );
};

export default Home;
