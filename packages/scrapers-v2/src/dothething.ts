import { parseRows } from "./parse/parse";
import dataScience2021 from "../results/major/Game_Art_and_Animation_BFA/tokens-2021.json"
import dataScience2022 from "../results/major/Game_Art_and_Animation_BFA/tokens-2022.json"
import { parseEntry } from "./runtime/pipeline";
import { TokenizedCatalogEntry } from "./runtime/types"
import { CatalogEntryType } from "./classify/types"
import { writeFile } from "fs/promises";

const tokens2021: TokenizedCatalogEntry = {
  url: new URL("https://example.com"),
  type: CatalogEntryType.Major,
  tokenized: dataScience2021 as any
}

const tokens2022: TokenizedCatalogEntry = {
  url: new URL("https://example.com"),
  type: CatalogEntryType.Major,
  tokenized: dataScience2022 as any
}

parseEntry(tokens2021).then(entry=>{
  writeFile("./Game_Art_and_Animation_BFA-2021.json", JSON.stringify(entry.parsed, null, 2))
})

parseEntry(tokens2022).then(entry=>{
  writeFile("./Game_Art_and_Animation_BFA-2022.json", JSON.stringify(entry.parsed, null, 2))
})



