import { load } from "cheerio";
import { Major, IMajorRequirementGroup, ANDSection, RANGESection, ORSection } from "../../frontend/src/models/types";

const rp = require("request-promise");

enum SectionType {
    AND,
    OR,
    RANGE
}

// Dictionary for ORSection keywords, maps from keyword/phrase -> number of credits
let ORTagMap: {[key: string]: number} = {
    "Complete one of the following": 4,
    "Complete two of the following": 8,
    "Complete three of the following": 12,
    "Complete two courses for one of the following science categories": 10,
    "Complete five courses from the following": 20
    // TODO: Data-Science-Related Electives: "Complete six courses from categories A and B, at least three of which must be from B"
};

// Dictionary for RANGESection keywords, maps from keyword/phrase -> number of credits
let RANGETagMap: {[key: string]: number} = {
    "Complete 8 credits of CS, IS or DS classes that are not already required. Choose courses within the following ranges": 8
};


/**
 * Scrapes the major data from the given course catalog URL.
 * @param link the URL string of the course catalog page to be parsed
 */
function catalogToMajor(link: string) {
    var options = {
        uri: link,
        transform: function (body: string) {
            return cheerio.load(body);
        }
    };

    rp(options)
        .then(($: CheerioStatic) => scrapeMajorDataFromCatalog($))
        .then((scrapedMajor: Major) => {
            //write the parse major data to database?
            let parsedMajorObject = parseMajorData(scrapedMajor);
            console.log("--------------------Parsed major object--------------------");
            console.log(JSON.stringify(parsedMajorObject));
        })
        .catch(function (err) {
            console.log(err)
        });
}

function scrapeMajorDataFromCatalog($: CheerioStatic): Promise<Major> {
    return new Promise<Major>((resolve, reject) => {
        $('#programrequirementstextcontainer table.sc_courselist').each((index: number, table: CheerioElement) => {
            let requirementGroupMap: { [key: string]: IMajorRequirementGroup } = createRequirementGroupMap($, table);
        });
    });
}

function createRequirementGroupMap($: CheerioStatic, table: CheerioElement): { [key: string]: IMajorRequirementGroup } {
    let requirementGroupMap: { [key: string]: IMajorRequirementGroup } = {};
    let rows: CheerioElement[] = [];
    $(table)
    .find("tr")
    .each((index: number, tableRow: CheerioElement) => {
        let currentRow: Cheerio = $(tableRow);
        if (currentRow.find("span.areaheader").length !== 0 && rows.length > 0) {
            let requirementGroup: IMajorRequirementGroup = createRequirementGroup($, rows);
            rows = [];
            requirementGroupMap[requirementGroup.name] = requirementGroup;
        }
        else {
            rows.push(tableRow);   
        }
    });
    return requirementGroupMap;
}

/**
 * Interprets a given list of rows and converts them to a valid major requirement group.
 * @param $ the given DOM passed along from createRequirementGroupMap()
 * @param rows the given list of rows within this major requirement group
 */
function createRequirementGroup($: CheerioStatic, rows: CheerioElement[]): IMajorRequirementGroup {
    //default section type set to AND.
    let sectionType: SectionType = SectionType.AND;

    rows.forEach((row: CheerioElement, index: number) => {
        // a courselistcomment is present in this row
        if ($("span.courselistcomment").length > 0) {
            if (ORTagMap.hasOwnProperty($("span.courselistcomment").text())) {
                //detected OR Tag; change section type to OR
                sectionType = SectionType.OR;
            } else if (RANGETagMap.hasOwnProperty($("span.courselistcomment").text())) {
                sectionType = SectionType.RANGE;
            }
        }
    });

    // convert the sectionType to a number.
    switch(+sectionType) {
        case SectionType.AND:
            return processAndSection(rows);
        case SectionType.OR:
            return processOrSection(rows);
        case SectionType.RANGE:
            return processRangeSection(rows);
        default:

    }
}

function processAndSection(rows: CheerioElement[]): ANDSection {

}

function processOrSection(rows: CheerioElement[]): ORSection {

}

function processRangeSection(rows: CheerioElement[]): RANGESection {
    
}

function scrapeMajor1DataFromCatalog($: CheerioStatic) {
    return new Promise((resolve, reject) => {
        let major = [$('#content .page-title').text(), $('#edition').text().split(" ")[0]]
        var sectionReq = []
        var sectionIsOrReq = false
        var sectionIsRange = false
        var orRequirement = "";
        var hoursReq = "";
        $('#programrequirementstextcontainer table.sc_courselist tr').each(function(index: number, element: CheerioElement) {
            element
            var currentRow = $(element);
            if (currentRow.find("span.areaheader").length !== 0 || currentRow.find("span.areasubheader").length !== 0) {
            //if (currentRow.find("span.areaheader").length !== 0) {
                sectionIsRange = false
                sectionIsOrReq = false;
                hoursReq = "";
                //add the previous orRequirement to the course data
                if (orRequirement !== "") {
                    sectionReq.push(orRequirement);
                    orRequirement = "";
                }
                if (sectionReq.length !== 0) {
                    major.push(sectionReq)
                    sectionReq = []
                }   
                let commentSpan = $(this);
                sectionReq.push(commentSpan.text());
            }
            if (currentRow.find("span.courselistcomment").length !== 0) {
                currentRow.find("span.courselistcomment").each(function() {
                    let commentSpan = $(this);
                    //should use regExp matching here
                    if (commentSpan.text().includes("Complete") || commentSpan.text().includes("Up to 4 semester hours may be research in a biology or chemistry faculty lab")) {
                        sectionIsOrReq = true;
                        hoursReq = currentRow.find("td.hourscol").text();
                    }
                    if (commentSpan.text().includes("Complete 8 credits of CS, IS or DS classes that are not already required. Choose courses within the following ranges")) {
                        sectionIsRange = true;
                        hoursReq = currentRow.find("td.hourscol").text();
                    }
                });
            }
            if (sectionIsRange) {
                if (sectionReq.length === 1) {
                    sectionReq.push("RANGE");
                    sectionReq.push(hoursReq);
                }
                if (currentRow.find("span.courselistcomment").length !== 0) {
                    let commentSpan = $(this);
                    let range = [];
                    commentSpan.find("a").each(function() {
                        let currentAnchor = $(this)
                        let courseNum = currentAnchor.text()
                        range.push(courseNum);
                    });
                    if (range.length !== 0) {
                        rangeString = range.join("-");
                        sectionReq.push(rangeString);
                    }
                }
            } else {
                if (currentRow.find("td.codecol a").length !== 0) {
                    var andRequirement = "";
                    currentRow.find("td.codecol a").each(function() {
                        let currentAnchor = $(this)
                        let courseNum = currentAnchor.text()
                        if (andRequirement !== "") {
                            courseNum = "%and%" + courseNum
                        }
                        andRequirement += courseNum
                    });
                    if (sectionIsOrReq) {
                        if (sectionReq.length === 1) {
                            sectionReq.push("OR");
                            sectionReq.push(hoursReq);
                        }
                        if (orRequirement !== "") {
                            orRequirement += "%or%" + andRequirement;
                        }
                        else {
                            orRequirement = andRequirement;
                        }
                    } else {
                        if (sectionReq.length === 1) {
                            sectionReq.push("AND");
                        }
                        //if this class has an or prefix, append to the last class added to the sectionReq.
                        if (currentRow.attr('class').includes('orclass')) {
                            sectionReq[sectionReq.length - 1] += "%or%" + andRequirement;
                        } else {
                            sectionReq.push(andRequirement);
                        }
                    }
                }
            }
        });
        if (orRequirement !== "") {
            sectionReq.push(orRequirement);
        }
        if (sectionReq.length !== 0) {
            major.push(sectionReq);
            sectionReq = []
        }
        console.log("--------------------Scraped major data--------------------");  
        console.log(major);
        resolve(major);
    });