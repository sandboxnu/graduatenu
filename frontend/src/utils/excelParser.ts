import XLSX from 'xlsx';

import {
    Schedule,
    ScheduleCourse,
    SeasonEnum,
    ScheduleYear,
    ScheduleTerm,
    StatusEnum
} from "../models/types";

const BASE_YEAR: number = 1000;


export function ExcelToSchedule(file : File) {
    const reader = new FileReader();
        reader.onload = function(e : any) {
        if (e != null && e.target != null) {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, {type: 'array'});
                const first_worksheet = workbook.Sheets[workbook.SheetNames[0]];
                console.log(first_worksheet['A2'])
                parseExcel(first_worksheet);
            }
        };
    reader.readAsArrayBuffer(file);
}

function parseExcel(worksheet : XLSX.WorkSheet) {
    let startCellIdx = getStartCellIndex(worksheet);
    console.log(startCellIdx);
    console.log(startCellIdx.length)
    if (startCellIdx.length < 2) {
        throw "Parsing Error";
    }

    let column: string = startCellIdx.charAt(0).toUpperCase();

    let fall = parseColumn(worksheet, SeasonEnum.FL, getIncrementedChar(column, 3), getIncrementedChar(column, 4), getIncrementedChar(column, 5), startCellIdx);
    let spring = parseColumn(worksheet, SeasonEnum.SP, getIncrementedChar(column, 6), getIncrementedChar(column, 7), getIncrementedChar(column, 8), startCellIdx);
    let summerOne = parseColumn(worksheet, SeasonEnum.S1, getIncrementedChar(column, 9), getIncrementedChar(column, 10), getIncrementedChar(column, 11), startCellIdx);
    let summerTwo = parseColumn(worksheet, SeasonEnum.S2, getIncrementedChar(column, 12), getIncrementedChar(column, 13), getIncrementedChar(column, 14), startCellIdx);
    const schedule: Schedule = createSchedule(fall, spring, summerOne, summerTwo);
    console.log(schedule);
}

function getIncrementedChar(c: string, num: number): string {
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

function createSchedule(fall: ScheduleTerm[], spring: ScheduleTerm[], summerOne: ScheduleTerm[], summerTwo: ScheduleTerm[]): Schedule {
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

function createYears(fall: ScheduleTerm[], spring: ScheduleTerm[], summerOne: ScheduleTerm[], summerTwo: ScheduleTerm[]): ScheduleYear[] {
    if (fall.length !== spring.length && spring.length !== summerOne.length && summerOne.length !== summerTwo.length) {
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
    classIdColumn: string, 
    classNameColumn: string, 
    classCreditColumn: string,
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
        classIdCell = classIdColumn + currentRowNumber.toString();
        classIdSubject = getCellValue(worksheet[classIdCell]).toUpperCase();
        classNameCell = classNameColumn + currentRowNumber.toString();
        className = getCellValue(worksheet[classNameCell]).toUpperCase();
        classCreditCell = classCreditColumn + currentRowNumber.toString();
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

function appendTerm(scheduleTerms: ScheduleTerm[], termToAppend: ScheduleTerm, parsedClasses: ScheduleCourse[], isCoop: boolean): ScheduleTerm[] {
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
    // TODO: Update termId and id
    const scheduleTerm: ScheduleTerm = {
        season: season,
        year: year,
        termId: 9999,
        id: 9999,
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
        classId = splitIdSubject[0]
        subject = splitIdSubject[1]
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