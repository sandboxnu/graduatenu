import bscs from "@graduate/scrapers-v2/test/bscs-tokens-v2.json"
import { parseRows } from "../parse/parse"
import { HDocument, HRow, HRowType } from "@graduate/scrapers-v2/src/tokenize/types";
import { CatalogEntryType } from "../classify/types";


interface prevStep {
  tokenized: HDocument;
  url: string;
  type: CatalogEntryType;
}

const importedTokens = bscs as prevStep

// const tokens = bscsTokens.filter((row)=>row.type !== HRowType.COMMENT)

// const parsed = parseRows(tokens)
// console.log(JSON.stringify(parsed, null, 4))

// const tokenized = bscs

let nonConcentrations = importedTokens.tokenized.sections.filter(metaSection => {
  // return true;
  return !metaSection.description.toLowerCase().startsWith("concentration")
})

let entries: HRow[][] = nonConcentrations.map((metaSection)=>metaSection.entries)

let allEntries = entries.reduce((prev: HRow[], current: HRow[])=>{
  return prev.concat(current)
}, [])

allEntries = allEntries.filter((row)=>row.type !== HRowType.COMMENT && row.type !== HRowType.SUBHEADER)

const allEntriesParsed = parseRows(allEntries)
console.log(JSON.stringify(allEntriesParsed, null, 4))

const concentrations = importedTokens.tokenized.sections.filter(metaSection => {
  return metaSection.description.toLowerCase().startsWith("Concentration")
})


export {}