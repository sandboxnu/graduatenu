import { SIDEBAR_DND_ID_PREFIX } from "../constants";

/** Is the the given DND course located in the Sidebar or being dragged from the Sidebar? */
export const isCourseFromSidebar = (dndId: string) => {
  return dndId.startsWith(SIDEBAR_DND_ID_PREFIX);
};
