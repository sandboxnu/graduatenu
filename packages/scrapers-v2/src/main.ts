import { CURRENT_CATALOG_YEAR, EARLIEST_CATALOG_YEAR } from "./constants";
import { runPipeline } from "./runtime/pipeline";
import { fatalError } from "./utils";

let args = process.argv.slice(2);
if (args.length === 0) {
  args = ["current"];
}

const years: number[] = args.map((arg: string)=>{
  if (arg === "current") {
    return CURRENT_CATALOG_YEAR
  }
  else if (arg.match(/\d{4}/)) {
    let year = Number(arg)
    if (year < EARLIEST_CATALOG_YEAR) {
      return fatalError(`Year "${year}" is earlier than the earliest catalog available as HTML (2016)!`)
    } else if (year > CURRENT_CATALOG_YEAR) {
      return fatalError("Either you're attempting to scrape a year in the future (which won't work unless time travel has been invented since this message was written), or you need to update CURRENT_CATALOG_YEAR in constants.ts.")
    }
    return year
  }
  else {
    return fatalError(`Unrecognized catalog year "${arg}"! Enter one or more valid catalog years or "current"`)
  }
})

async function runPipelines(years: number[]) {
  for (const year of years) {
    console.log(`Started scraping catalog year: ${year}...`)
    await runPipeline(year);
    console.log(`Finished scraping catalog year: ${year}!`)
  }
}


console.log(`Scraping the following years: ${years.join(", ")}...`)

runPipelines(years)
.then(()=>{
  console.log(`All years scraped!`)
})

