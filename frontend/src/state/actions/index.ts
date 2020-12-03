import * as majorsActions from "./majorsActions";
import * as userActions from "./userActions";
import * as plansActions from "./plansActions";
import * as userPlansActions from "./userPlansActions";
import * as advisorActions from "./advisorActions";
import { ActionType } from "typesafe-actions";

export type UserAction = ActionType<typeof userActions>;
export type MajorsApiAction = ActionType<typeof majorsActions>;
export type PlansApiAction = ActionType<typeof plansActions>;
export type UserPlansAction = ActionType<typeof userPlansActions>;
export type AdvisorAction = ActionType<typeof advisorActions>;
