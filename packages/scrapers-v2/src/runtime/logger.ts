import { Pipeline } from "./types";
import { ResultType } from "@graduate/common";
import { FilterError } from "./pipeline";
import { CatalogEntryType } from "../classify/types";

/**
 * Logs the progress of the scrape so the developer knows the scraper isn't deadlocked.
 *
 * As each individual entry pipeline completes, its status is logged. `.` for
 * success, `-` for filtered out, or a # representing the stage it errored on.
 *
 * @param pipelines The in-progress pipelines
 */
export const logProgress = async <T>(
  pipelines: Array<Promise<Pipeline<T>>>
) => {
  // set handlers to log the result of each pipeline
  for (const promise of pipelines) {
    promise.then(({ result, trace }) => {
      if (result.type === ResultType.Ok) {
        process.stdout.write(".");
      } else if (result.err[0] instanceof FilterError) {
        process.stdout.write("-");
      } else {
        process.stdout.write(String(trace.length));
      }
    });
  }

  const awaited = await Promise.all(pipelines);
  process.stdout.write("\n");
  return awaited;
};

/**
 * Logs scrape summary information, error messages, and the URLs of the catalog
 * entries that errored.
 *
 * Note: To display fewer stacktraces, the logger will try to aggregate them.
 * However, this doesn't always work with async stacktraces, so there might
 * sometimes appear two of the same stacktrace.
 *
 * @param results The completed pipelines
 */
export const logResults = <T>(results: Pipeline<T>[]) => {
  const stats = new StatsLogger();

  for (let i = 0; i < results.length; i += 1) {
    const { trace, result, id } = results[i];
    if (result.type === ResultType.Ok) {
      stats.recordField("status", "ok");
      continue;
    } else if (result.err[0] instanceof FilterError) {
      stats.recordField("status", "filtered");
      stats.recordField("filtered", result.err[0].actual);
      if (result.err[0].actual === CatalogEntryType.Unknown) {
        console.log("entry with unknown type:", id.toString());
      }
      continue;
    }

    stats.recordField("status", "error");
    stats.recordField("stage failures", trace[trace.length - 1]);

    for (const err of result.err) {
      if (err instanceof Error) {
        stats.recordError(err, id);
      } else {
        stats.recordError(new Error(`non-error value: ${err}`), id);
      }
    }
  }

  stats.print();
};

/**
 * Allows for "recording" fields (and errors) to print a breakdown of the
 * different values at the end.
 *
 * Each field value will be added to a tally. The # of occurrences of each value
 * for a field are then displayed when `print()` is called.
 *
 * Errors are also tallied. Error grouping is done by comparing stacktrace. This
 * doesn't quite work for async stacktraces, so sometimes two of the same error
 * are displayed separately.
 */
class StatsLogger {
  // field -> value -> count
  private fields: Record<string, Map<any, number>> = {};
  // message -> list -> stacktrace
  private errors: Map<
    string,
    Array<{ err: Error; count: number; annot: string; entryIds: URL[] }>
  > = new Map();

  /**
   * Records a field and its value, with the goal of printing the counts for
   * each different value the field has at the end.
   *
   * @param field The name of the field
   * @param value The value of the field
   */
  recordField(field: string, value: any) {
    if (field === "errors") {
      throw new Error(
        "cannot use 'errors' as a field key, use a different name"
      );
    }
    this.record(field, value);
  }

  /**
   * Records an error for a specific entry. Error uniqueness is determined by
   * stack trace. This doesn't quite work for async stacktraces, so sometimes
   * two of the same error are displayed separately.
   *
   * @param err     The error
   * @param entryId The entry URL
   */
  recordError(err: Error, entryId: URL) {
    const key = err.message ?? "had no stacktrace";
    const storedErrors = this.errors.get(key) ?? [];
    for (const stored of storedErrors) {
      // if the stacktrace matches, increment the count
      if (err.stack === stored.err.stack) {
        stored.count += 1;
        stored.entryIds.push(entryId);
        this.record("errors", stored.annot);
        return;
      }
    }
    const id = storedErrors.length === 0 ? "" : ` #${storedErrors.length}`;
    const annot = `${err.message}${id}`;
    // stacktrace didn't match, so add a new stacktrace entry for this error message
    storedErrors.push({ err, count: 1, annot, entryIds: [entryId] });
    this.errors.set(key, storedErrors);
    this.record("errors", annot);
  }

  private record(field: string, value: any) {
    if (!(field in this.fields)) {
      this.fields[field] = new Map();
    }
    const map = this.fields[field];
    map.set(value, (map.get(value) ?? 0) + 1);
  }

  /**
   * Prints field and error information.
   *
   * Prints stacktraces (with URLs) first, then aggregate information. Also
   * prints in order of # of occurrences.
   */
  print() {
    // log errors with stacktraces
    const errors = Array.from(this.errors.values())
      .flat()
      .sort((a, b) => b.count - a.count);
    for (const { err, count, annot, entryIds } of errors) {
      console.log(annot, count);
      console.error(err);
      console.log(entryIds.map((url) => url.toString()));
    }

    // log normal metrics (including error aggregates)
    for (const [field, map] of Object.entries(this.fields)) {
      console.log(field, ":");
      const entries = Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
      for (const entry of entries) {
        console.log("\t", ...entry);
      }
    }
  }
}
