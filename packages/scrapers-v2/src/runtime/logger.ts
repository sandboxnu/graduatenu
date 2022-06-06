import { Pipeline } from "./types";
import { ResultType } from "@graduate/common";
import { FilterError } from "./pipeline";
import { CatalogEntryType } from "../classify/types";

export const logProgress = async <T>(
  pipelines: Array<Promise<Pipeline<T>>>
) => {
  // set handlers to log the result of each pipeline
  for (const promise of pipelines) {
    promise.then(({ result, trace }) => {
      // for success log ".", for failure log "<n>" for the stage # that errored (starting at 1)
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
        console.log("entry with unknown type:", id);
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

class StatsLogger {
  private fields: Record<string, Map<any, number>> = {};
  private errors: Map<string, { err: Error; count: number; annot: string, entries: string[] }[]> =
    new Map();

  recordField(field: string, value: any) {
    if (field === "errors") {
      throw new Error(
        "cannot use 'errors' as a field key, use a different name"
      );
    }
    this.record(field, value);
  }

  recordError(err: Error, entryId: string) {
    const key = err.stack ?? "had no stacktrace";
    const storedErrors = this.errors.get(key) ?? [];
    for (const stored of storedErrors) {
      if (err.stack === stored.err.stack) {
        stored.count += 1;
        stored.entries.push(entryId);
        this.record("errors", stored.annot);
        return;
      }
    }
    const id = storedErrors.length === 0 ? "" : ` #${storedErrors.length}`;
    const annot = `${err.message}${id}`;
    storedErrors.push({ err, count: 1, annot, entries: [entryId] });
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

  print() {
    // log errors with stacktraces
    const errors = Array.from(this.errors.values())
      .flat()
      .sort((a, b) => b.count - a.count);
    for (const { err, count, annot, entries } of errors) {
      console.log(annot, count);
      console.error(err);
      console.log(entries);
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
