import {
  ICompleteCourse,
  IInitialScheduleRep,
  INEUAndPrereq,
  INEUClassMap,
  INEUCourse,
  INEUOrPrereq,
  INEUParentMap,
  INEUPrereq,
  INEUPrereqCourse,
  IOldRequirement,
  IRequiredCourse,
  ISchedule,
  IScheduleCourse,
  UserChoice,
  CourseTakenTracker,
  Schedule,
  ScheduleCourse,
  ScheduleYear,
} from "../../common/types";
import {
  courseCode,
  doesPrereqExist,
} from "../../frontend/src/utils/generate-warnings";
import { SeasonEnum, StatusEnum } from "../../frontend/src/models/types";

/**
 * converts from old schedule to new schedule
 * @param sched the old schedule.
 */
export function oldToNew(
  old: IInitialScheduleRep,
  parent: INEUParentMap
): Schedule {
  const byTermId: {
    termIds: number[];
    termMap: { [key: number]: ScheduleCourse[] };
  } = {
    termIds: [],
    termMap: {},
  };

  // parse all courses in dude.
  let allCourses: ICompleteCourse[] = [];
  allCourses = allCourses.concat(old.completed.courses);
  allCourses = allCourses.concat(old.inprogress.courses);
  for (const course of allCourses) {
    // if doesn't include termId, add.
    if (!byTermId.termIds.includes(course.termId)) {
      byTermId.termIds.push(course.termId);
      byTermId.termMap[course.termId] = [];
    }

    // get the searchNEU version.
    const detailed: INEUCourse | undefined = getSearchNEUData(course, parent);
    if (detailed) {
      byTermId.termMap[detailed.termId].push({
        classId: String(detailed.classId),
        subject: detailed.subject,
        prereqs: detailed.prereqs,
        coreqs: detailed.coreqs,
        numCreditsMin: detailed.minCredits,
        numCreditsMax: detailed.maxCredits,
        name: detailed.name,
      });
    } else {
      // it probably exists, but might not in the termId.
      const mostRecent: INEUCourse | undefined = getSearchNEUData(
        {
          subject: course.subject,
          classId: course.classId,
        },
        parent
      );

      if (mostRecent) {
        byTermId.termMap[course.termId].push({
          classId: String(course.classId),
          subject: course.subject,
          prereqs: mostRecent.prereqs,
          coreqs: mostRecent.coreqs,
          numCreditsMin: mostRecent.minCredits,
          numCreditsMax: mostRecent.maxCredits,
          name: mostRecent.name,
        });
      } else {
        byTermId.termMap[course.termId].push({
          classId: String(course.classId),
          subject: course.subject,
          prereqs: undefined,
          coreqs: undefined,
          numCreditsMin: course.creditHours,
          numCreditsMax: course.creditHours,
          name: course.name,
        });
      }
    }
  }

  // add to the born child.
  const born: Schedule = {
    years: [],
    yearMap: {},
  };

  // get all the years
  let years: number[] = [];
  for (const termId of byTermId.termIds) {
    if (!years.includes(Math.floor(termId / 100))) {
      years.push(Math.floor(termId / 100));
    }
  }

  // create each year object
  for (const year of years) {
    const yearObject: ScheduleYear = {
      year: year,
      fall: {
        season: SeasonEnum.FL,
        year: year,
        termId: year * 100 + 10,
        status: StatusEnum.INACTIVE,
        classes: [],
      },
      spring: {
        season: SeasonEnum.SP,
        year: year,
        termId: year * 100 + 30,
        status: StatusEnum.INACTIVE,
        classes: [],
      },
      summer1: {
        season: SeasonEnum.S1,
        year: year,
        termId: year * 100 + 40,
        status: StatusEnum.INACTIVE,
        classes: [],
      },
      summer2: {
        season: SeasonEnum.S2,
        year: year,
        termId: year * 100 + 60,
        status: StatusEnum.INACTIVE,
        classes: [],
      },
      isSummerFull: false,
    };

    if (byTermId.termMap[year * 100 + 10]) {
      for (const course of byTermId.termMap[year * 100 + 10]) {
        yearObject.fall.status = StatusEnum.CLASSES;
        yearObject.fall.classes.push(course);
      }
    }
    if (byTermId.termMap[year * 100 + 30]) {
      for (const course of byTermId.termMap[year * 100 + 30]) {
        yearObject.spring.status = StatusEnum.CLASSES;
        yearObject.spring.classes.push(course);
      }
    }
    if (byTermId.termMap[year * 100 + 40]) {
      for (const course of byTermId.termMap[year * 100 + 40]) {
        yearObject.summer1.status = StatusEnum.CLASSES;
        yearObject.summer1.classes.push(course);
      }
    }
    if (byTermId.termMap[year * 100 + 60]) {
      for (const course of byTermId.termMap[year * 100 + 60]) {
        yearObject.summer2.status = StatusEnum.CLASSES;
        yearObject.summer2.classes.push(course);
      }
    }
    born.years.push(year);
    born.yearMap[year] = yearObject;
  }

  return born;
}

/**
 * Attempts to grab searchNEU data for a course, using that course's termId to lookup the corresponding file.
 * If no termId is found, automatically uses the most recent semester on record.
 * May return undefined.
 * @param course A course object (hopefully).
 * @param classMapParent The parent classMap object, with props "mostRecentSemester" and "allTermIds"
 * @returns Produces the corresponding searchNEU data for a class, if it exists. else => undefined.
 */
export const getSearchNEUData = (
  course:
    | ICompleteCourse
    | IRequiredCourse
    | INEUCourse
    | INEUPrereqCourse
    | IScheduleCourse
    | IOldRequirement,
  classMapParent: INEUParentMap
): INEUCourse | undefined => {
  /**
   * Grabs the data of a specified class.
   * @param classObj The class object containing a classMap and termId.
   * @param subject The subject (college abbreviation) of the target course.
   * @param classId course number of the target course.
   * @returns The resulting class object (if found).
   */
  function getClassData(
    classObj: INEUClassMap,
    potentialSubject: string,
    potentialClassId: number
  ) {
    // classes can be accessed by the 'neu.edu/201830/<COLLEGE>/<COURSE_NUMBER>' attribute of each "classmap"
    const query =
      "neu.edu/" +
      classObj.termId +
      "/" +
      potentialSubject +
      "/" +
      potentialClassId;
    return classObj.classMap[query];
  }

  // skip doing work if there's no work to do.
  if (!course) {
    return undefined;
  }

  const subject: string | undefined = course.subject;
  const classId: number | undefined = Number(course.classId);
  let termId: number | undefined;
  let classMap: INEUClassMap | undefined;
  if ("termId" in course) {
    termId = course.termId;
    classMap = classMapParent.classMapMap[termId];
  }

  if (classId && subject && termId && classMap) {
    // if everything is valid, then query the classMap
    // console.log("data found for: " + subject + classId);
    return getClassData(classMap, subject, classId);
  } else if (subject && classId && !termId) {
    // if only the subject and classId are valid, guess the termId from most recent => least recent
    const allTermIds = classMapParent.allTermIds;
    for (const currentTermId of allTermIds) {
      classMap = classMapParent.classMapMap[currentTermId];
      const data: INEUCourse | undefined = getClassData(
        classMap,
        subject,
        classId
      );
      if (data) {
        // if the data exists, then return. otherwise keep searching.
        // console.log("data found in term: " + termId + " for course: " + subject + classId);
        return data;
      }
    }
    // if not found, then return undefined
    // console.log("data not found for:");
    // console.log(course);
    return undefined;
  } else {
    // if we have no subject and classId, then we don't even know what course to search for.
    // console.log("data not found for:");
    // console.log(course);
    return undefined;
  }
};

/**
 * Returns if the classList contains the given class, by attr and course #.
 * @param classList The list of classes.
 * @param c The class to find.
 * @returns True if class is found.
 */
const containsClass = (
  classList: ICompleteCourse[],
  target: ICompleteCourse
): boolean => {
  // For each of the courses, if they match subject and classId, then return true.
  for (const course of classList) {
    if (
      course.subject === target.subject &&
      course.classId === target.classId
    ) {
      return true;
    }
  }

  // Otherwise target not found, return false.
  return false;
};

/**
 * Adds the completed classes to the schedule. Does mutation. Returns void.
 * @param schedule The schedule in JSON format.
 * @param completedClasses A list of the completed classes.
 */
const addCompleted = (
  schedule: ISchedule,
  completedClasses: ICompleteCourse[]
): void => {
  // Set schedule.completed to completedClasses.
  schedule.completed = completedClasses;
};

/**
 * Graph for running topological sort on prerequisites.
 * @param adjList Adjacency list to keep track of edges.
 * @param numIncoming The number of incoming edges each vertex has.
 * @param vertices The vertices of the Graph.
 */
export class Graph<T> {
  // fields
  private adjList: Map<T, T[]>;
  private numIncoming: Map<T, number>;
  private vertices: T[];

  /**
   * Constructor for graph. Takes no inputs.
   */
  public constructor() {
    this.adjList = new Map<T, T[]>();
    this.numIncoming = new Map<T, number>();
    this.vertices = [];
  }

  /**
   * Adds a vertex to the graph.
   * @param v The vertex to add.
   */
  public addVertex(v: T): void {
    // If the vertex is already added, don't overwrite the data!
    if (!this.hasVertex(v)) {
      this.adjList.set(v, []);
      this.numIncoming.set(v, 0);
      this.vertices.push(v);
    }
  }

  /**
   * Adds an edge to the graph.
   * @param v The 'from' vertex.
   * @param w The 'to' vertex.
   */
  public addEdge(v: T, w: T): void {
    // If we already have the edge, don't overwrite the data!
    if (!this.hasEdge(v, w)) {
      // typescript is dump, doesn't know that adjList.get(v) must be defined if !this.hasEdge(v, w)
      this.adjList.get(v)!.push(w);
      this.numIncoming.set(w, this.numIncoming.get(w)! + 1);
    }
  }

  /**
   * Returns if vertex v is in |V|.
   * @param v The vertex to check.
   * @returns A boolean, true if v in |V|.
   */
  public hasVertex(v: T): boolean {
    return this.adjList.get(v) !== undefined;
  }

  /**
   * Returns if edge(from, to) exists in |E|.
   * @param from The 'from' edge.
   * @param to The 'to' edge.
   * @returns A boolean, true if edge(from, to) in |E|.
   */
  public hasEdge(from: T, to: T): boolean {
    // If both vertices exist, test if edge exists.
    if (this.hasVertex(from) && this.hasVertex(to)) {
      // Does the adjList for "from" contain "to"?
      const neighbors = this.adjList.get(from);

      // We know neighbors can't be null/undefined, because from and to are vertices.
      for (const v of neighbors!) {
        if (v === to) {
          return true;
        }
      }
    }

    // Otherwise, wasn't found, return false.
    return false;
  }

  /**
   * Produces a 2D array with nested arrays having length "width" using the Coffman/Graham's algorithm.
   * Only guaranteed to work on DAGs.
   * @param width The width of the schedule to produce.
   * @returns An array of T[], where result[0] is the first round.
   */
  public toCoffmanGraham(width: number): T[][] {
    // Technically for coffman/graham, we need to find the transitive reduction
    // for this DAG before computing topological ordering, but we'll skip it for now.
    // todo: implement transitive reduction.

    // Convert topological sorted list to a coffman graham schedule of width "width".
    const order: T[] = this.toTopologicalOrdering();

    // If, while at a particular round, the next task to be scheduled has a dependency that’s also scheduled for that
    // same round, we have no choice but to leave the remaining CPUs unused and start the next round.

    const schedule: T[][] = [[]];
    let currentLevel: number = 0;

    /**
     * Returns if a conflict exists between T and the current level at schedule[level].
     * @param level The index of the current level in the schedule.
     * @param toAdd The T to add to the schedule.
     */
    const conflictExist = (level: number, toAdd: T) => {
      // Keep track of stuff we have seen as object properties.
      const seen: Set<T> = new Set<T>();

      // For each one of the things already added, does toAdd come after the thing already added?
      let check: T[] = schedule[level];
      let newCheck: T[] = [];

      // While we still have stuff to check,
      while (check.length > 0) {
        // Check them.
        for (const v of check) {
          if (!seen.has(v)) {
            // if it's the item, then return true, (a conflict exists).
            if (v === toAdd) {
              return true;
            } else {
              // if we haven't seen the item, then add all the neighbors of item to newCheck.
              seen.add(v);
              // we know adjList.get(v) is defined.
              this.adjList.get(v)!.forEach(neighbor => {
                newCheck.push(neighbor);
              });
            }
          }
        }
        check = newCheck;
        newCheck = [];
      }

      return false;
    };

    // For each of the items in order,
    for (const v of order) {
      // If a conflict doesn't exist at the current level and we haven't yet filled up the level,
      // add v to the current level.
      if (
        schedule[currentLevel].length < width &&
        !conflictExist(currentLevel, v)
      ) {
        // if no conflict exists, add.
        schedule[currentLevel].push(v);
      } else {
        // Otherwise, increment the current level and add the item (no conflicts yet exist).
        currentLevel += 1;
        schedule.push([v]);
      }
    }

    return schedule;
  }

  /**
   * Produces a valid topological ordering for this graph.
   * Tiebreaks by choosing vertices with the earliest most recently added incoming neighbor of v,
   * or vertices with less incoming neighbors.
   * @returns A topological ordering of T[].
   */
  public toTopologicalOrdering(): T[] {
    // produced order
    const order: T[] = [];

    // ready list, incoming neighbors map, incoming # map, added index map.
    const ready: T[] = [];
    const incomingNeighbors = new Map<T, T[]>();
    const numIncomingNeighbors = new Map<T, number>();
    const addedIndex = new Map<T, number>();

    // initialize the lists of all the vertices for incoming neighbors.
    this.vertices.forEach(v => incomingNeighbors.set(v, []));

    // build ready list, incoming neighbors map, incoming # map, added index map.
    this.vertices.forEach(v => {
      // add each node with zero incoming edges to ready.
      if (this.numIncoming.get(v) === 0) {
        ready.push(v);
      }

      // add each one of the neighbors of v to v's incoming neighbors map.
      this.adjList.get(v)!.forEach(n => incomingNeighbors.get(n)!.push(v));

      // duplicate the entry for numIncomingNeighbors from this.numIncoming.
      numIncomingNeighbors.set(v, this.numIncoming.get(v)!);

      // set the addedIndex entry to -1.
      addedIndex.set(v, -1);
    });

    /**
     * Whether or not we have another vertex.
     */
    const hasNextVertex = (): boolean => ready.length > 0;

    /**
     * Gets the next vertex v, such that the
     * most recent incoming neighbor of v comes before any other vertex that could be added instead of v.
     * Breaks ties by using the second most recent incoming neighbor, and so on, and then by
     * whichever vertex has less neighbors.
     */
    const getNextVertex = (): T | undefined => {
      // make sure we have a next vertex.
      if (!hasNextVertex()) {
        return undefined;
      }

      // track the best vertex.
      let bestVertex: T = ready[0];
      let indexBestVertex: number = 0;

      // our possible candidates include everything in ready[]. starts at index 1.
      for (let i: number = 1; i < ready.length; i += 1) {
        const v: T = ready[i];
        if (addedIndex.get(v)! < addedIndex.get(bestVertex)!) {
          // if we are strictly better (more previous), then set and move on.
          bestVertex = v;
          indexBestVertex = i;
        } else if (addedIndex.get(v) === addedIndex.get(bestVertex)) {
          // if we are the same, need to break ties
          // ties broken by using index of second most recently added incoming neighbor, etc., etc.

          // get the incoming neighbors of contesting vertices.
          // map incoming vertices to their index in ready (if it exists).
          // sort greatest => least.
          const incomingV: number[] = incomingNeighbors
            .get(v)!
            .map(ne => ready.indexOf(ne));
          incomingV.sort((a1, a2) => a2 - a1);
          const incomingBest: number[] = incomingNeighbors
            .get(bestVertex)!
            .map(ne => ready.indexOf(ne));
          incomingBest.sort((a1, a2) => a2 - a1);

          // whether or not we broke the tie.
          let tiebroke = false;

          // the very first thing in both lists SHOULD be what we compared earlier (which should be equal).
          // go down the list until one of them isn't the same as the other.
          for (
            let j = 0;
            j < Math.min(incomingV.length, incomingBest.length);
            j += 1
          ) {
            // if they are not equal, choose the one that has the lower index.
            if (incomingV[j] !== incomingBest[j]) {
              tiebroke = true;
              if (incomingV[j] < incomingBest[j]) {
                // use v, as incoming
                bestVertex = v;
                indexBestVertex = j;
              } else {
                // otherwise, not == and v !< best => v > best, keep best.
              }
              break;
            }
          }

          // if we did not successfully tiebreak, then use the one with fewer incoming edges.
          if (!tiebroke && incomingV.length < incomingBest.length) {
            bestVertex = v;
            indexBestVertex = i;
          }
        }
      }

      // we have now selected a vertex to return. now we need to update tables.
      // ready, incoming neighbors, numincoming neighbors, added index.

      // remove from ready, update order.
      order.push(ready[indexBestVertex]);
      // the index that we added ready[indexBestVertex] at in order.
      const orderedIndex: number = order.length - 1;

      // for each of the outgoing neighbors of bestVertex, update numIncoming and addedIndex.
      this.adjList.get(bestVertex)!.forEach(v => {
        // update numIncomingNeighbors.
        numIncomingNeighbors.set(v, numIncomingNeighbors.get(v)! - 1);

        // potentially add the vertex to ready
        if (numIncomingNeighbors.get(v) === 0) {
          ready.push(v);
        }

        // update the addedIndex
        // invariant: orderedIndex will always be greater than addedIndex
        addedIndex.set(v, orderedIndex);
      });

      // we are done. return the selected vertex.
      return ready.splice(indexBestVertex, indexBestVertex + 1)[0];
    };

    // while we have things to add, add them to order.
    while (hasNextVertex()) {
      // this says "get", but it itself mutated order (adds to).
      getNextVertex();
    }

    return order;
  }
}

// the following functions are for prerequisite parsing. a prerequisite object is defined below:

/**
 * Filters and simplifies the provided prereq object.
 * If a prereq does not exist, then it is undefined. Ignores courses marked as "missing".
 * @param completed The completed classes (in SearchNEU format).
 * @param prereqObj The prereq object to filter
 * @returns The simplified prerequisite object.
 */
const filterAndSimplifyPrereqs = (
  completed: INEUCourse[],
  prereqObj: INEUAndPrereq | INEUOrPrereq
): undefined | INEUAndPrereq | INEUOrPrereq => {
  // a prereq is an object and has the following properties:
  // "type": one of "and" or "or"
  // "values": an array [] of course objects or more prereqs

  // a course is an object and has the following properties:
  // "classId": 4 digit number in string format. ex "2500"
  // "subject": the course attribute. ex "CS" or "MATH"
  // "missing": if object property exists, then value is true (boolean).

  /**
   * Returns if the provided prereq object is an INEUAndPrereq.
   * @param prereq The prereq object in question.
   */
  const isAnd = (
    prereq: INEUAndPrereq | INEUOrPrereq
  ): prereq is INEUAndPrereq => {
    if ((prereq as INEUAndPrereq).type === "and") {
      return true;
    } else {
      return false;
    }
  };

  // make a look up table for instant indexing:
  const hasBeenCompleted: { [key: string]: boolean } = {};

  // mark all the completed courses as completed, in our hashmap object.
  // todo: we only need to do this once for the array of prereq objects to go through for a full degree audit.
  for (const course of completed) {
    hasBeenCompleted[courseCode(course)] = true;
  }

  /**
   * Recursively filters classes from a provided prerequisite object in SearchNEU format.
   * @param oldPrereqObj The prereq object to filter old classes from.
   */
  const filterPrereq = (
    oldPrereqObj: INEUAndPrereq | INEUOrPrereq
  ): undefined | INEUAndPrereq | INEUOrPrereq => {
    // if we have no prereqs, skip.
    if (oldPrereqObj === undefined) {
      return undefined;
    }

    if (isAnd(oldPrereqObj)) {
      // oldPrereqObj is INEUAndPrereq
      return filterAndPrereq(oldPrereqObj);
    } else {
      // oldPrereqObj is INEUOrPrereq
      return filterOrPrereq(oldPrereqObj);
    }
  };

  /**
   * Recursively filters classes from a provided prerequisite object in SearchNEU format.
   * Returns undefined if all of the prereq's requirements have been satisfied, indicating the prereq is complete.
   * @param andPrereq The AND-type prereq object to filter old classes from.
   * @returns The simplified prerequisite object.
   */
  const filterAndPrereq = (
    andPrereq: INEUAndPrereq
  ): INEUAndPrereq | undefined => {
    const dealtWith: Array<
      INEUAndPrereq | INEUOrPrereq | INEUPrereqCourse
    > = [];

    // conditionally add the non-completed prerequisite classes.
    for (const prereq of andPrereq.values) {
      if ("type" in prereq) {
        // case 1: prereq is an and or or.
        const parsed = filterPrereq(prereq);
        if (parsed) {
          dealtWith.push(prereq);
        }
      } else if (!prereq.missing && !hasBeenCompleted[courseCode(prereq)]) {
        // case 2: prereq is a course, not missing
        dealtWith.push(prereq);
      }
      // case 3: prereq is a course, and is missing. Do nothing.
    }

    // if we filtered them all out, return undefined (no more prereqs!)
    if (dealtWith.length > 0) {
      return { type: "and", values: dealtWith };
    } else {
      return undefined;
    }
  };

  /**
   * Recursively filters classes from a provided prerequisite object in SearchNEU format,
   * according to a provided object map.
   * Returns undefined if one of the prereq's requirements have been satisfied, indicating the prereq is complete.
   * @param orPrereq The OR-type prereq object to filter old classes from.
   * @returns The simplified prereq object.
   */
  const filterOrPrereq = (
    orPrereq: INEUOrPrereq
  ): INEUAndPrereq | INEUOrPrereq | undefined => {
    const dealtWith: Array<
      INEUAndPrereq | INEUOrPrereq | INEUPrereqCourse
    > = [];

    // if any one of the prereqs have been satisfied => return undefined.
    for (const prereq of orPrereq.values) {
      if ("type" in prereq) {
        // case 1: prereq is an and or or.
        const parsed = filterPrereq(prereq);
        if (parsed) {
          // case 1.1: prereq is not complete. add it.
          dealtWith.push(parsed);
        } else {
          // case 1.2: prereq is complete. we are done.
          return undefined;
        }
      } else if (!prereq.missing && !hasBeenCompleted[courseCode(prereq)]) {
        // case 2: prereq is a prereq course that is NOT missing, and has NOT been completed. Then add it.
        dealtWith.push(prereq);
      } else {
        // case 3: prereq is a prereq course that is missing. skip.
      }
    }

    if (dealtWith.length === 0) {
      // If dealtWith is empty, return undefined.
      return undefined;
    } else if (dealtWith.length === 1) {
      // If dealtWith is length 1, return an AND prerequisite.
      return { type: "and", values: dealtWith };
    } else {
      // Otherwise, return OR prerequisite.
      return { type: "or", values: dealtWith };
    }
  };

  // update the prereqs of each remaining requirement to its simplified and filtered version.
  return filterPrereq(prereqObj);
};

/**
 * Produces a graph of the provided list of SearchNEU formatted class objects.
 * Uses class prereqs to create edges. Uses courseCode to name nodes.
 * @param completed The completed classes.
 * @param filteredRequirements The remaining requirements to schedule.
 * @param curriedGetSearchNEUData A function course => course, looks up searchNEUdata for a course.
 * @returns The produced graph, complete with edges.
 */
const createPrerequisiteGraph = (
  completed: INEUCourse[],
  filteredRequirements: INEUCourse[],
  curriedGetSearchNEUData: (
    arg0:
      | ICompleteCourse
      | IRequiredCourse
      | INEUCourse
      | INEUPrereqCourse
      | IScheduleCourse
  ) => INEUCourse | undefined
): Graph<string> => {
  // todo: replace input types with IHasSubject and IHasClassId and IHasTermId

  // make the graph
  // must exist as a reference for the helper functions.
  const graph: Graph<string> = new Graph();

  // add all vertices to the graph.
  // must be added for the helper functions.
  for (const course of filteredRequirements) {
    graph.addVertex(courseCode(course));
  }

  // helper functions for doing prereq graph edges.
  // rely on having local reference "graph" available.
  const tracker: CourseTakenTracker = {
    contains: (code: string) => !graph.hasVertex(code),
    addCourse: (course: ScheduleCourse | INEUCourse) =>
      graph.addVertex(courseCode(course)),
    addCourses: (toAdd: ScheduleCourse[] | INEUCourse[]) =>
      toAdd.forEach((single: ScheduleCourse | INEUCourse) =>
        graph.addVertex(courseCode(single))
      ),
    getTermIds: (course: string) => [], // This callback is to be used generate-warnings.ts
  };

  // following functions rely on local reference "completed"

  /**
   * Recursively adds the prereq edges of a prereq object to a graph, for a specified course.
   * @param to The courseCode of the course we are computing prereqs for. Creates edges to here.
   * @param prereq The prereq object of the course we are computing prereqs for.
   */
  const markPrereq = (
    to: string,
    prereq: INEUAndPrereq | INEUOrPrereq
  ): void => {
    // if undefined, return

    if (prereq.type === "and") {
      // if is an AND prereq, mark as AND prereq.
      markAndPrereq(to, prereq);
    } else if (prereq.type === "or") {
      // if is an OR prereq, mark as OR prereq.
      markOrPrereq(to, prereq);
    }
  };

  /**
   * Recursively adds the prereq edgese of an AND-type prereq to a graph.
   * @param to The courseCode of the course we are computing prereqs for.
   * @param prereq The prerequisite object of the course we are computing prereqs for.
   */
  const markAndPrereq = (to: string, prereq: INEUAndPrereq): void => {
    // Parse the prereq. If result is undefined, we are done.
    const parsedPrereq:
      | INEUOrPrereq
      | INEUAndPrereq
      | undefined = filterAndSimplifyPrereqs(completed, prereq);
    if (!parsedPrereq) {
      return;
    }

    // For each of the prereqs, add an edge from the prereq to us.
    for (const subPrereq of parsedPrereq.values) {
      // here, we'd only like to process if we have a defined course.
      // if we have another prereq object, we'd like to process after all the other OR objects.
      // this is in an ideal world. perhaps sort the prereqs beforehand for processing order.

      if ("type" in subPrereq) {
        // if we are another prereq, mark.
        markPrereq(to, subPrereq);
      } else {
        // if we are a defined course, mark.
        const from = courseCode(subPrereq);
        graph.addVertex(from);
        graph.addEdge(from, to);

        // next mark all the prerequisites of the local course itself, if they exist.
        const prereqCourseData:
          | undefined
          | INEUCourse = curriedGetSearchNEUData(subPrereq);
        if (prereqCourseData && prereqCourseData.prereqs) {
          const nestedPrereqs:
            | INEUAndPrereq
            | INEUOrPrereq
            | undefined = filterAndSimplifyPrereqs(
            completed,
            prereqCourseData.prereqs
          );

          if (nestedPrereqs) {
            markPrereq(from, nestedPrereqs);
          }
        }
      }
    }
  };

  /**
   * Recursively adds the prereq edges of the OR-type prereq to a graph
   * @param to The coruseCode of the course we are computing prereqs for. name of the node in the graph.
   * @param prereq The prerequisite object of the course we are compting prereqs for.
   */
  const markOrPrereq = (to: string, prereq: INEUOrPrereq): void => {
    // Parse the prereq. If the result doesn't exist, escape.
    const parsedPrereq:
      | INEUOrPrereq
      | INEUAndPrereq
      | undefined = filterAndSimplifyPrereqs(completed, prereq);
    if (!parsedPrereq) {
      return;
    }

    // keep track of indices
    let lastNestedIndex = -1;
    let lastNormalIndex = -1;

    // for each of the prereq courses:
    for (let i = 0; i < parsedPrereq.values.length; i += 1) {
      const subPrereq: INEUPrereq = parsedPrereq.values[i];

      if ("type" in subPrereq) {
        // we have a nested or prereq. what a pain.
        lastNestedIndex = i;

        // if we already have the prereq, then mark.
        // todo: get rid of calling doesPrereqExist causing circular loops.
        if (doesPrereqExist(subPrereq, tracker)) {
          markPrereq(to, prereq);
          return;
        }
      } else {
        // we have a normal course prereq. yay!
        lastNormalIndex = i;

        const from = courseCode(subPrereq);

        if (graph.hasVertex(from)) {
          // if we already have the vertex, then mark.
          // exit, or has been fulfilled.
          graph.addEdge(from, to);
          return;
        }
      }
    }

    // if none of the courses were satisfied, add the last vertex and edge.
    // we'd prefer to add a normal prereq (non-nested) before a nested.
    let toAdd;

    // find the proper index to add.
    if (lastNormalIndex !== -1) {
      toAdd = prereq.values[lastNormalIndex];
    } else {
      toAdd = prereq.values[lastNestedIndex];
    }

    // if we are a subPrereq, mark.
    if ("type" in toAdd) {
      markPrereq(to, toAdd);
    } else {
      // if we are a defined course, mark.
      const from = courseCode(toAdd);
      graph.addVertex(from);
      graph.addEdge(from, to);

      // next mark all the prerequisites of the local course itself, if they exist.
      const subPrereqCourseData = curriedGetSearchNEUData(toAdd);

      if (subPrereqCourseData && subPrereqCourseData.prereqs) {
        const nestedPrereqs = filterAndSimplifyPrereqs(
          completed,
          subPrereqCourseData.prereqs
        );
        if (nestedPrereqs) {
          markPrereq(from, nestedPrereqs);
        }
      }
    }
  };

  // END HELPER FUNCTIONS

  // begin processing the items.

  // process the "and" prereqs before the "or" prereqs.
  for (const course of filteredRequirements) {
    // if prereqs exist and are of type "and", mark them.
    if (course.prereqs && course.prereqs.type === "and") {
      markAndPrereq(courseCode(course), course.prereqs);
    }
  }

  // process the "or" prereqs
  for (const course of filteredRequirements) {
    const prereqs = course.prereqs;

    // if the course has no prereqs, then skip.
    if (prereqs === undefined) {
      continue;
    } else if (prereqs.type === "or") {
      // if any of the prereqs have been completed, abort.
      markOrPrereq(courseCode(course), prereqs);
    }
  }

  // return the graph
  return graph;
};

/**
 * Adds the required classes to the schedule. Does mutation. Returns void.
 * @param schedule The schedule in JSON format.
 * @param completed The completed classes (in SearchNEU format).
 * @param remainingRequirements The remaining requirements (in SearchNEU format).
 * @param curriedGetSearchNEUData A function course => course that produces searchNEU data for a course.
 */
const addRequired = (
  schedule: ISchedule,
  completed: INEUCourse[],
  remainingRequirements: INEUCourse[],
  curriedGetSearchNEUData: (
    arg0:
      | ICompleteCourse
      | IRequiredCourse
      | INEUCourse
      | INEUPrereqCourse
      | IScheduleCourse
  ) => INEUCourse | undefined
): void => {
  // precondition: schedule is full up to some point. need to fill with remaining requirements.

  // filter and simplify the requirements according to completed classes.
  // let newRequirements = filterAndSimplifyPrereqs(completed, remainingRequirements);

  // use those filtered classes to greate a prerequisite edge graph.
  const topo = createPrerequisiteGraph(
    completed,
    remainingRequirements,
    curriedGetSearchNEUData
  );

  // we should now have a complete graph with edges.
  // console.log(topo.adjList);

  // perform topological sort/coffman algorithm to produce an ordering with width 4.
  const coffmanGraham = topo.toCoffmanGraham(4);
  // console.log(coffmanGraham);

  // adds the produced ordering to the schedule under the property "scheduled".
  schedule.scheduled = coffmanGraham;
};

/**
 * Parses the provided JSON file to an output JSON file, organized chronologically.
 * @param audit The parsed audit.
 * @param classMapParent A classMap parent with each classMap under its corresponding termId.
 * @returns The resulting schedule object.
 */
export const toSchedule = (
  audit: IInitialScheduleRep,
  classMapParent: INEUParentMap
): ISchedule => {
  const schedule: ISchedule = {
    completed: [],
    scheduled: [[]],
  };

  // add the completed classes. this works!
  addCompleted(schedule, audit.completed.courses);

  // need to still add the remaining NUPaths, audit.completed.nupaths

  // convert the stuff to userchoice | schedulecourse.

  // todo: convert from IOldRequirement to Requirement representation.
  // schedule course -> ineu course map, then pass to completed param
  function temp(
    course: UserChoice | IScheduleCourse
  ): undefined | IScheduleCourse {
    if (!("type" in course)) {
      return course;
    } else {
      return undefined;
    }
  }

  // const requirements: Requirement[] = audit.requirements.courses;
  // const converted: Array<Array<UserChoice | IScheduleCourse>> = requirements
  // .map((course: Requirement) => parseRequirement(course));
  // const flattened: Array<UserChoice | IScheduleCourse> = converted.reduce((acc, val) => acc.concat(val), []);
  // const filtered: IScheduleCourse[] = flattened
  // .filter((course: UserChoice | IScheduleCourse): boolean => (!("type" in course)));

  const curriedGetData = (
    course:
      | ICompleteCourse
      | IRequiredCourse
      | INEUCourse
      | INEUPrereqCourse
      | IScheduleCourse
      | IOldRequirement
  ) => getSearchNEUData(course, classMapParent);

  // remove null stuff. typescript is annoying.
  function filterUndefined<T>(toFilter: Array<T | undefined>): T[] {
    const result: T[] = [];
    for (const maybeUndefined of toFilter) {
      if (maybeUndefined) {
        result.push(maybeUndefined);
      }
    }
    return result;
  }

  // filter through the completed classes to pull up their data.
  // only keep the stuff with actual results.
  const completed = audit.completed.courses.map((course: ICompleteCourse) =>
    getSearchNEUData(course, classMapParent)
  );
  const required = audit.requirements.courses.map(course =>
    curriedGetData(course)
  );
  const completedFiltered: INEUCourse[] = filterUndefined(completed);
  const requiredFiltered: INEUCourse[] = filterUndefined(required);

  // add the remaining required classes.
  // note, expects data in SearchNEU format

  // only pass this function scheduled courses, not choices for user
  addRequired(schedule, completedFiltered, requiredFiltered, curriedGetData);

  return schedule;
};
