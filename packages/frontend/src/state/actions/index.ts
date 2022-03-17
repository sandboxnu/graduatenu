import * as majorsActions from "./majorsActions";
import * as studentActions from "./studentActions";
import * as plansActions from "./plansActions";
import * as userPlansActions from "./userPlansActions";
import * as advisorActions from "./advisorActions";
import { ActionType } from "typesafe-actions";

export type StudentAction = ActionType<typeof studentActions>;
export type MajorsApiAction = ActionType<typeof majorsActions>;
export type PlansApiAction = ActionType<typeof plansActions>;
export type UserPlansAction = ActionType<typeof userPlansActions>;
export type AdvisorAction = ActionType<typeof advisorActions>;
