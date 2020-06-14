import { bioChemPlans } from "./plans-2018-biochem";
import { mathPlans } from "./plans-2018-math";
import { csPlans } from "./plans-2018-purecs";
import { biochemMajor } from "../majors/BIOCHEMISTRY, BS";
import { Schedule } from "graduate-common";
import { mathMajor } from "../majors/MATHEMATICS, BS";
import { csMajor } from "../majors/COMPUTER SCIENCE, BSCS";

export const plans: Record<string, Schedule[]> = {
  [biochemMajor.name]: bioChemPlans,
  [mathMajor.name]: mathPlans,
  [csMajor.name]: csPlans,
};
