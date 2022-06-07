# Runtime/pipeline

This folder contains code to glue all the individual stages of the scraper pipeline together and make it run. This also includes code for error handling and logging, to make the scrapers easier to debug.

## Design constraints

The pipeline was constructed with several goals in mind. the full planning doc can be found [here](https://www.notion.so/sandboxnu/Scraper-Brainstorming-61261181144c4dac82488255cfa34744).

high level goals:

1. be confident my changes are not breaking anything
2. be able to test changes on the full catalog
3. be able to hack on compiler with minimal compilers experience

this manifested itself in running the pipeline for each catalog entry independently (so that one entry can't break the entire pipeline), and also putting a lot of effort in making logging good (diagnostics and aggregate info across entries).

## High level strategy

There are roughly three steps to running the pipeline:

1. scrape URLs to all the entries
2. for each URL, run the pipeline
3. log a summary of what happened

Each step is described more in detail in the next section, but at a high level, this is all that the entire pipeline does.

The main entrypoint for the scrapers can be found in `pipeline.ts` in a function called `runPipeline`.

## Implementation Details

### step 1: URL scraping

The first step is the only step that cannot occur for each entry separately: scraping the URLs of all the entries. However, so that a single URL failing does not break the whole scrape, we ignore URLs that fail to fetch.

Eventually, it may be beneficial to add retry logic for the URLs that fail.

There is one problem: making a lot of HTTP requests at the same time can overload node. To get around this, we limit the number of in-flight requests that axios can make to 100. The code for this lives in `axios.ts`. All the stages that make HTTP requests are affected by this (urls, classify, and tokenize), so we install the limiters before and after running the entire pipeline.

### step 2: PIPELINE

At a high level, we want to take an input and apply a series of functions to it in order. however, at each point, if the function fails, we want to error out, and skip the rest of the functions.

The way we put the pipeline together is by using Promises: we can very easily apply a series of asynchronous functions using the `.then()` method of a promise.

#### addPhase

To do this, we use the `addPhase` function. It essentially takes a function and wraps it in a try/catch so that errors don't break the whole scraper.

The types for this function are a little hard to read, but essentially it just wraps each stage in a try/catch, so that if the stage errors out, the scrape doesn't explode.

It also skips the stage if there was already an error earlier on in the pipeline.

It also allows for labelling stages with a `Phase`, to record what stages the pipeline got to via a trace.

#### `Pipeline` datatype

The `Pipeline` datatype is just to give us some handy bookkeeping, namely an identifier (URL to the entry), the aforementioned trace of the phases completed, and the current value in the pipeline as a result (either ok or error). 

### step 3: logging

there are two steps to logging: first showing progress, so that the developer can know that the scraper is actually running/doing something. this is done via the `logProgress` function. as each individual entry pipeline completes, its status is logged. `.` for success, `-` for filtered out, or a # representing the stage it errored on.

the second step is logging metrics and aggregations. this is done with the `logResults` method, in tandem with the `StatsLogger` class.

#### StatsLogger

the `StatsLogger` class allows for "recording" fields (and errors) to print a breakdown of the different values at the end.

to record a field, you specify the field label and its value. the number of occurrences of each value is tallied as the field is recorded.

for example, let's say we want to record the label "status". if we call the method with "filtered" three times, "ok" once, and "error" twice, and then call `logger.print()`, the logger will print out the following (note, will sort field value in order of # of occurrences):

```
status:
    filtered: 3
    error: 2
    ok: 1
```

to record errors, it's basically a variation of the same thing (record and tally occurrences). the only difference is that we also want to print out the entry IDs (url) associated with each error, so we track that as well.

#### logResuts

this function pretty much just uses the StatsLogger to record certain information, and should be straightforward enough to read through.

## Running

to run the scraper, cd into the `packages/scrapers-v2` directory and run `yarn scrape`.

## Future Work

See the bottom of the notion page for an up-to-date list of future work.

- save stage output(s) to file
- show diff at each stage
- specify select URLs to run on for faster dev feedback loop
- specify select stages to run for faster dev feedback loop

