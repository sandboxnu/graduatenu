import { Major2 } from "@graduate/common";

import * as Computer_Science_and_Business_Administration_BS_2021 from "./Computer_Science_and_Business_Administration_BS/Computer_Science_and_Business_Administration_BS-2021.json";
import * as Computer_Science_and_Music_with_Concentration_in_Music_Technology_BS_2021 from "./Computer_Science_and_Music_with_Concentration_in_Music_Technology_BS/Computer_Science_and_Music_with_Concentration_in_Music_Technology_BS-2021.json";
// import * as Computer_Science_BSCS_2021 from "./Computer_Science_BSCS/Computer_Science_BSCS-2021.json";
import * as Cybersecurity_and_Business_Administration_BS_2021 from "./Cybersecurity_and_Business_Administration_BS/Cybersecurity_and_Business_Administration_BS-2021.json";
import * as Cybersecurity_BS_2021 from "./Cybersecurity_BS/Cybersecurity_BS-2021.json";
import * as Data_Science_and_Business_Administration_BS_2021 from "./Data_Science_and_Business_Administration_BS/Data_Science_and_Business_Administration_BS-2021.json";
import * as Data_Science_BS_2021 from "./Data_Science_BS/Data_Science_BS-2021.json";
import * as Game_Art_and_Animation_BFA_2021 from "./Game_Art_and_Animation_BFA/Game_Art_and_Animation_BFA-2021.json";

import * as Computer_Science_and_Business_Administration_BS_2022 from "./Computer_Science_and_Business_Administration_BS/Computer_Science_and_Business_Administration_BS-2022.json";
import * as Computer_Science_and_Music_with_Concentration_in_Music_Technology_BS_2022 from "./Computer_Science_and_Music_with_Concentration_in_Music_Technology_BS/Computer_Science_and_Music_with_Concentration_in_Music_Technology_BS-2022.json";
import * as Computer_Science_BSCS_2022 from "./Computer_Science_BSCS/Computer_Science_BSCS-2022.json";
import * as Cybersecurity_and_Business_Administration_BS_2022 from "./Cybersecurity_and_Business_Administration_BS/Cybersecurity_and_Business_Administration_BS-2022.json";
import * as Cybersecurity_BS_2022 from "./Cybersecurity_BS/Cybersecurity_BS-2022.json";
import * as Data_Science_and_Business_Administration_BS_2022 from "./Data_Science_and_Business_Administration_BS/Data_Science_and_Business_Administration_BS-2022.json";
import * as Data_Science_BS_2022 from "./Data_Science_BS/Data_Science_BS-2022.json";
import * as Game_Art_and_Animation_BFA_2022 from "./Game_Art_and_Animation_BFA/Game_Art_and_Animation_BFA-2022.json";

const SUPPORTED_MAJORS_2021: Record<string, Major2> = {
  [Computer_Science_and_Business_Administration_BS_2021.name]:
    Computer_Science_and_Business_Administration_BS_2021 as any,
  [Computer_Science_and_Music_with_Concentration_in_Music_Technology_BS_2021.name]:
    Computer_Science_and_Music_with_Concentration_in_Music_Technology_BS_2021 as any,
  // [Computer_Science_BSCS_2021.name]: Computer_Science_BSCS_2021 as any,
  [Cybersecurity_and_Business_Administration_BS_2021.name]:
    Cybersecurity_and_Business_Administration_BS_2021 as any,
  [Cybersecurity_BS_2021.name]: Cybersecurity_BS_2021 as any,
  [Data_Science_and_Business_Administration_BS_2021.name]:
    Data_Science_and_Business_Administration_BS_2021 as any,
  [Data_Science_BS_2021.name]: Data_Science_BS_2021 as any,
  [Game_Art_and_Animation_BFA_2021.name]:
    Game_Art_and_Animation_BFA_2021 as any,
};

const SUPPORTED_MAJORS_2022: Record<string, Major2> = {
  [Computer_Science_and_Business_Administration_BS_2022.name]:
    Computer_Science_and_Business_Administration_BS_2022 as any,
  [Computer_Science_and_Music_with_Concentration_in_Music_Technology_BS_2022.name]:
    Computer_Science_and_Music_with_Concentration_in_Music_Technology_BS_2022 as any,
  [Computer_Science_BSCS_2022.name]: Computer_Science_BSCS_2022 as any,
  [Cybersecurity_and_Business_Administration_BS_2022.name]:
    Cybersecurity_and_Business_Administration_BS_2022 as any,
  [Cybersecurity_BS_2022.name]: Cybersecurity_BS_2022 as any,
  [Data_Science_and_Business_Administration_BS_2022.name]:
    Data_Science_and_Business_Administration_BS_2022 as any,
  [Data_Science_BS_2022.name]: Data_Science_BS_2022 as any,
  [Game_Art_and_Animation_BFA_2022.name]:
    Game_Art_and_Animation_BFA_2022 as any,
};

const SUPPORED_MAJORS_NAMES_2021 = Object.keys(SUPPORTED_MAJORS_2021);
const SUPPORED_MAJORS_NAMES_2022 = Object.keys(SUPPORTED_MAJORS_2022);

/** Year => { Major Name => Major2, Supported Major Names => [Major Name] } */
export const SUPPORTED_MAJORS: Record<
  string,
  { majors: Record<string, Major2>; supportedMajorNames: string[] }
> = {
  "2021": {
    majors: SUPPORTED_MAJORS_2021,
    supportedMajorNames: SUPPORED_MAJORS_NAMES_2021,
  },
  "2022": {
    majors: SUPPORTED_MAJORS_2022,
    supportedMajorNames: SUPPORED_MAJORS_NAMES_2022,
  },
};

export const SUPPORTED_MAJOR_YEARS = Object.keys(SUPPORTED_MAJORS);
