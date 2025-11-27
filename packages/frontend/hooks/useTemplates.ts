import { API } from "@graduate/api-client";
import useSWR from "swr";

export const USE_TEMPLATES_SWR_KEY = "templates";

/** Hook to fetch all available templates */
export function useAllTemplates() {
  const {
    data,
    error,
    isValidating: isLoading,
  } = useSWR(USE_TEMPLATES_SWR_KEY, async () => {
    return await API.templates.getAll();
  });

  return {
    templatesData: data,
    isLoading,
    error,
  };
}

/** Hook to fetch templates for a specific catalog year */
export function useTemplatesForYear(catalogYear?: number | null) {
  const {
    data,
    error,
    isValidating: isLoading,
  } = useSWR(
    catalogYear ? `${USE_TEMPLATES_SWR_KEY}/${catalogYear}` : null,
    async () => {
      if (catalogYear) {
        return await API.templates.getForYear(catalogYear);
      }
      return null;
    }
  );

  return {
    templatesForYear: data,
    isLoading,
    error,
  };
}

/** Hook to check if a template exists for a specific major and catalog year */
export function useHasTemplate(
  majorNames?: string[] | null,
  catalogYear?: number | null
) {
  const { templatesForYear, isLoading } = useTemplatesForYear(catalogYear);

  const hasTemplate = Boolean(
    majorNames && templatesForYear && templatesForYear[majorNames[0]]
  );

  return {
    hasTemplate,
    isLoading,
  };
}

/** Hook to fetch a specific template for a major and catalog year */
export function useTemplate(
  majorNames?: string[] | null,
  catalogYear?: number | null
) {
  const {
    data,
    error,
    isValidating: isLoading,
  } = useSWR(
    majorNames?.[0] && catalogYear
      ? `${USE_TEMPLATES_SWR_KEY}/${catalogYear}/${majorNames[0]}`
      : null,
    async () => {
      if (majorNames && catalogYear) {
        return await API.templates.getForMajor(majorNames[0], catalogYear);
      }
      return null;
    }
  );

  return {
    template: data ?? null,
    isLoading,
    error,
  };
}
