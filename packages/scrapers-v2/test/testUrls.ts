export const format = (path: string) =>
  new URL(`https://catalog.northeastern.edu${path}`);
const cs = (path: string) =>
  format(`/undergraduate/computer-information-science/${path}`);
const csCom = (path: string) =>
  cs(`/computer-information-science-combined-majors/${path}`);

export const CS_GAME_DEV = format(
  "/undergraduate/computer-information-science/computer-information-science-combined-majors/computer-science-game-development-bs"
);
export const BUSINESS = format(
  "/undergraduate/business/business-administration-bsba"
);
export const PHYSICS = format("/undergraduate/science/physics/physics-bs");

export const BSCS = cs("computer-science/bscs");
export const BACS = cs("computer-science/bacs/");
export const CYBER = cs("cybersecurity/cybersecurity-bs/");
export const DS = cs("data-science/data-science-bs/");
export const CS_CHEM = format(
  "/undergraduate/engineering/chemical/chemical-engineering-computer-science-bsche/"
);
export const CS_CIVIL_E = format(
  "/undergraduate/engineering/civil-environmental/civil-engineering-computer-science-bsce/"
);
export const CECS = format(
  "/undergraduate/engineering/electrical-computer/computer-engineering-computer-science-bscompe/"
);
export const CS_NEURO = csCom("computer-science-behavioral-neuroscience-bs/");
export const CS_BIO = csCom("computer-science-biology-bs/");
export const CS_BUS_ADMIN = csCom(
  "computer-science-business-administration-bs/"
);
export const CS_COG_PSYC = csCom("computer-science-cognitive-psychology-bs/");
export const CS_COMM = csCom("computer-science-communication-studies-bs/");
export const CS_CRIM = csCom("computer-science-criminal-justice-bs/");
export const CS_DESIGN = csCom("computer-science-design-bs/");
export const CS_ECON = csCom("economics-bs/");
export const CS_ENGLISH = csCom("computer-science-english-bs/");
export const CS_ENVIRO = csCom(
  "computer-science-environmental-sustainability-sciences-bs/"
);
export const CS_GAME = csCom("computer-science-game-development-bs/");
export const CS_HISTORY = csCom("computer-science-history-bs/");
export const CS_JOUR = csCom("computer-science-journalism-bs/");
export const CS_LING = csCom("computer-science-linguistics-bs/");
export const CS_MATH = csCom("computer-science-mathematics-bs/");
export const CS_MED_ARTS = csCom("computer-science-media-arts-bs/");
// halfway done, got more to go

export const CS_MUSIC_WITH_TECH_MAJOR = csCom(
  "computer-science-concentration-music-composition-technology-bs"
);

export const MEDIA_SCREEN_STUDIES_HISTORY = format(
  "/undergraduate/arts-media-design/communication-studies/media-screen-studies-history-ba"
);
export const CHEMICAL_ENG = format(
  "/undergraduate/engineering/chemical/chemical-engineering-bsche"
);
export const ACCOUNTING_MINOR = format(
  "/undergraduate/business/interdisciplinary-minors/accounting-advisory-services-minor"
);
export const ARCHITECTURE_MINOR = format(
  "/undergraduate/arts-media-design/architecture/architectural-design-minor"
);
export const FINTECH_CONCENTRATION = format(
  "/undergraduate/business/concentrations/fintech"
);
export const AEROSPACE_MINOR = format(
  "/undergraduate/engineering/mechanical-industrial/aerospace-minor"
);
export const ACCEL_DEG_PROG_KHOURY = format(
  "/undergraduate/computer-information-science/accelerated-bachelor-graduate-degree-programs"
);
export const WOMEN_GENDER_SEXUALITY_MINOR = format(
  "/undergraduate/social-sciences-humanities/interdisciplinary/womens-gender-sexuality-studies-minor"
);
export const DIGITAL_METHODS_HUMANITIES_MINOR = format(
  "/undergraduate/social-sciences-humanities/interdisciplinary/digital-methods-in-the-humanities-minor"
);
export const MATH_POLYSCI = format(
  "/undergraduate/science/mathematics/mathematics-political-science-bs/"
);
export const GLOBAL_BUS_STRATEGY_MINOR = format(
  "/undergraduate/business/concentrations/global-business-strategy/"
);
// no tabs
export const ARCH_ENGLISH = format(
  "/undergraduate/arts-media-design/architecture/architecture-english-bs/"
);
export const ACCEL_DEG_PROG_CAMD = format(
  "/undergraduate/arts-media-design/accelerated-bachelor-graduate-degree-programs"
);
export const ACCEL_DEG_PROG_BUSINESS = format(
  "/undergraduate/business/accelerated-bachelor-graduate-degree-programs"
);
export const ACCEL_DEG_PROG_ENG = format(
  "/undergraduate/engineering/accelerated-bachelor-graduate-degree-programs"
);
export const ACCEL_DEG_PROG_HEALTH = format(
  "/undergraduate/health-sciences/accelerated-bachelor-graduate-degree-programs"
);
export const ACCEL_DEG_PROG_COS = format(
  "/undergraduate/science/accelerated-bachelor-graduate-degree-programs"
);
export const ACCEL_DEG_PROG_CSSH = format(
  "/undergraduate/social-sciences-humanities/accelerated-bachelor-graduate-degree-programs"
);
// OR of ANDs
export const BIOENG_BIOCHEM = format(
  "/undergraduate/engineering/bioengineering/bioengineering-biochemistry-bsbioe"
);
export const PUBLIC_HEALTH_BA = format(
  "/undergraduate/health-sciences/community-health-behavioral-sciences/public-health-ba"
);
export const PHARM_SCI_BS = format(
  "/undergraduate/health-sciences/pharmacy/pharmaceutical-sciences-bs"
);
export const PHARM_STUDIES_BS = format(
  "/undergraduate/health-sciences/pharmacy/pharmacy-studies-bs"
);
export const PHARMD = format(
  "/undergraduate/health-sciences/pharmacy/pharmacy-pharmd"
);
