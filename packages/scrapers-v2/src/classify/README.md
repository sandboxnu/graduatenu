# Classify

This folder contains code for the catalog entry classification stage of the scraper pipeline. In this stage, we classify catalog entries and annotate them with their type.

## Design

This strategy was mostly born through testing against the entire catalog, made easier by the existence of the `StatsLogger` class and the runtime.

## Classification Strategy

We try three different ways of categorizing an entry, in order. The first that returns a non-unknown type is returned. Here is a simple outline representing the strategy priority (in order):

1. if the entry name contains a comma and the name after comma matches one of the following:
   - is `minor` -> minor
   - starts with `bs` -> major
   - starts with `b` and ends with `a` -> major
   - starts with `ba` -> major
   - else try strategy 2
2. has tabs, and second tab text is:
   - `program requirements` -> major
     - caveat: some minors have `program requirements`, but all the ones that do should be categorized by strategy 1.
   - `minor requirements` -> minor
   - `concentration requirements` -> concentration
   - else try strategy 3
3. if exactly 1 element exist with id ending in `programrequirementstext` and matches one of the following:
   - begins `program` -> major
   - begins `minor` -> minor
   - begins `concentration` -> concentration
   - else return unknown

### How it does

The vast majority of entries should be able to be categorized by strategy 1. There are ~17 that require strategy two (for example, the business concentrations), and finally there is only 1 that requires strategy 3 (the global business strategy business concentration, for some reason).

Finally, the only unclassified entries (8 of them, at the time of writing) are the accelerated degree programs, and the first year engineering program.

### Examples

- categorized by name:
  - [comp sci - major](https://catalog.northeastern.edu/undergraduate/computer-information-science/computer-science/bscs/)
  - [business - minor](https://catalog.northeastern.edu/undergraduate/business/interdisciplinary-minors/accounting-advisory-services-minor/)
  - [behavioral neuroscience - major](https://catalog.northeastern.edu/undergraduate/science/behavioral-neuroscience/behavioral-neuroscience-philosophy-bs/)
    - this one is special: the "BS" is capitalized
  - [math and polysci - major](https://catalog.northeastern.edu/undergraduate/science/mathematics/mathematics-political-science-bs/)
    - also special: has no tabs! thankfully good ol' strategy 1 comes first
- categorized by tabs:
  - no commas in the title:
    - [business analytics - concentration](https://catalog.northeastern.edu/undergraduate/business/concentrations/business-analytics/)
    - [fintech - concentration](https://catalog.northeastern.edu/undergraduate/business/concentrations/fintech/)
  - has a comma, but ending doesn't match one of the expected:
    - [pharmd - major](https://catalog.northeastern.edu/undergraduate/health-sciences/pharmacy/pharmacy-pharmd/)
- categorized by containerId:
  - https://catalog.northeastern.edu/undergraduate/business/concentrations/global-business-strategy/
    - has no comma in the title, AND ALSO has no tabs! wowzers. good thing we have backup strategy # 3
- unknowns
  - [cs accelerated degree program](https://catalog.northeastern.edu/undergraduate/computer-information-science/accelerated-bachelor-graduate-degree-programs/)
  - [first year engineering](https://catalog.northeastern.edu/undergraduate/engineering/first-year-engineering/)
