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
    - OrOfAndCourseRow (hour, list of (classId, subject, ...))
  - RangeRow
    - boundedRangeRow (hour, subject, startId, endId)
    - unboundedRangeRow (hour, subj)
    - lowerBoundedRangeRow (hour, subject, startId)
    - lowerBoundedRangeRowWithExceptions (hour, subject, startId, exceptionsIds[])

### Edge cases

Some catalog entries do not have tabs, so instead of finding the courses container via the tabs, we just look throughout the page for an element with id ending in `requirementstextcontainer`.

Some courses are also an OR of ANDs, for example, [this one](https://catalog.northeastern.edu/undergraduate/engineering/bioengineering/bioengineering-biochemistry-bsbioe/#programrequirementstext) - search "phys 1155". In this case, it is an OR of the previous row, but also is an AND, having its own sub-courses. Additionally, rows of this type have no column for hours.
