# Classify

This folder contains code for the catalog entry classification stage of the scraper pipeline. In this stage, we classify
catalog entries and annotate them with their type.

## Classification Strategy

We classify catalog entries by looking at the set of tabs (if it exists) at the top of the page. Here is a breakdown of
the identifiable traits of our currently recognized entry types, by type:

| Type          | Has Tabs? | # Tabs | Text of the 2nd tab        |
|---------------|-----------|--------|----------------------------|
| Major         | Yes       | 3      | Program Requirements       |
| Minor         | Yes       | 2      | Minor Requirements         |
| Concentration | Yes       | 2      | Concentration Requirements |
| Unknown       | No        | N/A    | N/A                        |

For an entry to be classified as a specific type, it must have attributes that match the expected for each of the
columns, ie `has tabs?`, `# tabs`, and `text of the 2nd tab`. If an entry does not match any of the recognized types, it
is classified as Unknown.

Also, as with other stages, if we encounter any case not exactly matching the above table, we treat it as an error, and
error out. This is for the sake of _correctness_, as cases we do not support **should explicitly be errors**.

## Implementation Details

We rely on each page to have its tabs container identifiable by the following selector: `#contentarea #tabs`. We then
also expect the container to contain tabs text under an unordered list `ul` and then each tab as a `li`, so the tab
texts can be selected as `ul > li`. 