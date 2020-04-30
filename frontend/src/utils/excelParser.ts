import XLSX from 'xlsx';
import {
    Schedule,
    ScheduleCourse,
    SeasonEnum,
    ScheduleYear,
    ScheduleTerm,
    StatusEnum
} from "../models/types";
import { convertSeasonToTermId } from './schedule-helpers';

const BASE_YEAR: number = 1000;

export function ExcelToSchedule(file: File, callback: ((schedule: Schedule) => any)) {
    const reader = new FileReader();
    reader.onload = function(e : any) {
    if (e != null && e.target != null) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, {type: 'array'});
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            callback(parseExcelAndCreateSchedule(worksheet));
        }
    };
    reader.readAsArrayBuffer(file);
}

function parseExcelAndCreateSchedule(worksheet : XLSX.WorkSheet): Schedule {
    // Find beginning of table
    let startCellIdx = getStartCellIndex(worksheet);
    if (startCellIdx.length < 2) {
        throw "Parsing Error";
    }

    // Get columns that need to be parsed
    let column: string = startCellIdx.charAt(0).toUpperCase();
    const fallColumns: string[] = [getChar(column, 3), getChar(column, 4), getChar(column, 5)];
    const springColumns: string[] = [getChar(column, 6), getChar(column, 7), getChar(column, 8)];
    const summerOneColumns: string[] = [getChar(column, 9), getChar(column, 10), getChar(column, 11)];
    const summerTwoColumns: string[] = [getChar(column, 12), getChar(column, 13), getChar(column, 14)];

    // Parse the columns
    let fall = parseColumn(worksheet, SeasonEnum.FL, fallColumns, startCellIdx);
    let spring = parseColumn(worksheet, SeasonEnum.SP, springColumns, startCellIdx);
    let summerOne = parseColumn(worksheet, SeasonEnum.S1, summerOneColumns, startCellIdx);
    let summerTwo = parseColumn(worksheet, SeasonEnum.S2, summerTwoColumns, startCellIdx);

    const schedule = createSchedule(fall, spring, summerOne, summerTwo);
    return schedule;
}

function getChar(c: string, num: number): string {
    return String.fromCharCode(c.charCodeAt(0) + num);
}

function getStartCellIndex(worksheet: XLSX.WorkSheet): string {
    let cell = "A1";
    let cellVal;
    for(let i = 0; i < 26; i++) {
        for (let j = 1; j < 100; j++) {
            cell = String.fromCharCode(97 + i).toUpperCase() + j.toString();
            cellVal = getCellValue(worksheet[cell]).toUpperCase();
            if (cellVal === "YEAR OF STUDY") {
                return cell;
            }
        }
    }
    return "";
}

function createSchedule(
    fall: ScheduleTerm[], 
    spring: ScheduleTerm[], 
    summerOne: ScheduleTerm[], 
    summerTwo: ScheduleTerm[]
    ): Schedule {
    const schedule: Schedule = {
        years: [],
        yearMap: {},
        id: "excel-schedule",
    };

    const years = createYears(fall, spring, summerOne, summerTwo);
    for (const year of years) {
        schedule.years.push(year.year);
        schedule.yearMap[year.year] = year;
    }
    return schedule;
}

function createYears(
    fall: ScheduleTerm[], 
    spring: ScheduleTerm[], 
    summerOne: ScheduleTerm[], 
    summerTwo: ScheduleTerm[]
    ): ScheduleYear[] {
    if (fall.length !== spring.length 
        && spring.length !== summerOne.length 
        && summerOne.length !== summerTwo.length) {
        throw "parser parsed inconsitently";
    }

    let years: ScheduleYear[] = [];
    for(let i = 0; i < fall.length; i++) {
        years.push({
            year: fall[i].year,
            fall: fall[i],
            spring: spring[i],
            summer1: summerOne[i],
            summer2: summerTwo[i],
            isSummerFull: false
        })
    }
    return years;
}

function parseColumn(
    worksheet: XLSX.WorkSheet,
    season: SeasonEnum,
    columns: string[],
    startCellIdx: string
    ): ScheduleTerm[] {

    let currentRowNumber: number = parseInt(startCellIdx.substring(1)) + 2;
    const YEAR_COLUMN = startCellIdx.charAt(0);
    // ClassId
    let classIdCell;
    let classIdSubject: string;
    // ClassName
    let classNameCell;
    let className: string;
    // Credit
    let classCreditCell;
    let classCredit: string;
    //Year
    let yearCell;
    let year: string;

    let currentYear = BASE_YEAR;

    let scheduleTerms: ScheduleTerm[] = [];
    let currentScheduleTerm: ScheduleTerm = generateNewScheduleTerm(season, currentYear);
    
    let parsedClasses: ScheduleCourse[] = [];
    let isCoop = false;

    while (currentRowNumber < 100) {
        // Get classinfo
        classIdCell = columns[0] + currentRowNumber.toString();
        classIdSubject = getCellValue(worksheet[classIdCell]).toUpperCase();
        classNameCell = columns[1] + currentRowNumber.toString();
        className = getCellValue(worksheet[classNameCell]).toUpperCase();
        classCreditCell = columns[2] + currentRowNumber.toString();
        classCredit = getCellValue(worksheet[classCreditCell]).toUpperCase();

        // Update year info 
        yearCell = YEAR_COLUMN + currentRowNumber.toString();
        year = getCellValue(worksheet[yearCell]);

        // Check to see if we're done parsing
        if (year == 'Total Planned Hours') {
            // Return collected classes
            scheduleTerms = appendTerm(scheduleTerms, currentScheduleTerm, parsedClasses, isCoop)
            return scheduleTerms;
        }

        // Check to see if we're on a new term
        if (year && parseInt(year) - 1 + BASE_YEAR != currentYear) {
            scheduleTerms = appendTerm(scheduleTerms, currentScheduleTerm, parsedClasses, isCoop)
            isCoop = false;
            parsedClasses = [];
            currentYear = parseInt(year) - 1 + BASE_YEAR;
            currentScheduleTerm = generateNewScheduleTerm(season, currentYear);
        }
        
        if (classIdSubject.length > 0 
            && !classIdSubject.includes("SEMESTER")
            && !classIdSubject.includes("FALL ")
            && !classIdSubject.includes("SPRING ")
            && !classIdSubject.includes("SUMMER ")) {
            if (classIdSubject == 'CO-OP') {
                isCoop = true
            } else {
                parsedClasses.push(getScheduleCourse(classIdSubject, className, classCredit))
            }
        }

        currentRowNumber++;
    }
    return scheduleTerms;   
}

function getCellValue(cell: XLSX.CellObject): string {
    if (cell && cell.v) {
        return cell.v.toString();
    }
    return '';
}

function appendTerm(
    scheduleTerms: ScheduleTerm[], 
    termToAppend: ScheduleTerm, 
    parsedClasses: ScheduleCourse[], 
    isCoop: boolean
    ): ScheduleTerm[] {
    // Append old term
    if (isCoop) {
        termToAppend.status = StatusEnum.COOP;
    } else if (parsedClasses.length > 0) {
        termToAppend.status = StatusEnum.CLASSES;
    }

    termToAppend.classes = parsedClasses
    scheduleTerms.push(termToAppend)
    return scheduleTerms;
}

function generateNewScheduleTerm(season: SeasonEnum, year: number): ScheduleTerm {
    let termId = convertSeasonToTermId(season)
    let id = year + termId;

    const scheduleTerm: ScheduleTerm = {
        season: season,
        year: year,
        termId: year * 100 + termId,
        id: id,
        classes: [],
        status: StatusEnum.INACTIVE
    }
    return scheduleTerm;
}

function getScheduleCourse(classIdSubject: string, name: string, credits: string): ScheduleCourse {
    let splitIdSubject = classIdSubject.split(" ");
    let classId = "9999";
    let subject = "XXXX";
    if (splitIdSubject.length > 1) {
        subject = splitIdSubject[0].trim();
        classId = splitIdSubject[1].trim();
    }

    let parsedClass: ScheduleCourse = {
        name: name,
        classId: classId,
        subject: subject,
        numCreditsMin: parseInt(credits),
        numCreditsMax: parseInt(credits),
    }

    return parsedClass;
}