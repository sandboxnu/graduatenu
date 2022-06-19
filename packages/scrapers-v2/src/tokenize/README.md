# Tokenize

This folder contains code for the **tokenize** (aka lexing) stage of the scraper, which handles converting the HTML of a course catalog page into distinct recognized pieces, known as "tokens".

If the tokenizer finds a token that it does not recognize, it should explicitly error, to make the devs aware of an unhandled case (so that they can later add support for it).

## Catalog Page Structure

For more specific docs on what shape we expect the catalog entry pages to exist in, please see the `types.ts` file.

At a high level, each catalog page consists of a bunch of `sections`.

Each section then contains a list of `rows`. A section also has a text descriptor.

There are a lot of different types of rows. Here's a breakdown:

- Row
  - TextRow
    - AreaHeader (description, hour)
    - Comment (description, hour)
    - Subheader (description, hour)
  - CourseRow
    - CourseRow (description, subject, hour, classId)
    - OrCourseRow (description, subject, hour, classId)
  - MultiCourseRow
    - AndCourseRow (hour, list of (classId, subject, ...))
  - RangeRow
    - boundedRangeRow (hour, subject, startId, endId)
    - unboundedRangeRow (hour, subj)
    - lowerBoundedRangeRow (hour, subject, startId)
    - lowerBoundedRangeRowWithExceptions (hour, subject, startId, exceptionsIds[])
