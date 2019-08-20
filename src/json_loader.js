/**
 * This file has functions that load the classmaps that json_parser.js requires in order to lookup course information.
 */

const fs = require('fs');
const https = require('https');

// the year
const YEAR = '2019';

// the possible seasons to choose from.
// note that "years" begin in the fall of the previous year. 
// [Fall, Spring, SummerI, SummerFUll, SummerII]
const SEASONS = ["10", "30", "40", "50", "60"];

const SEASON_LINKS = SEASONS.map(season => 'https://searchneu.com/data/v2/getTermDump/neu.edu/' + YEAR + season + '.json');
// the download links for the fall and spring course data.
const FALL = SEASON_LINKS[0];
const SPRING = SEASON_LINKS[1];
const SUMMER1 = SEASON_LINKS[2];
const SUMMERF = SEASON_LINKS[3];
const SUMMER2 = SEASON_LINKS[4];

/**
 * Provides an array of the links to the classMap files for a specified year.
 * @param {String} year The 4-digit year to retrieve links for
 * @returns {String[]} The strings of the links for the five files.
 */
let getClassMapLinks = year => 
SEASONS.map(season => 'https://searchneu.com/data/v2/getTermDump/neu.edu/' + year + season + '.json');

/**
 * Provides an array of filepath locations to the classMap files based on a provided year.
 * @param {String} year The target year. expected as a string or number. in the form "2019".
 * @returns {String[]} The names of the five files.
 */
let getClassMapFilePaths = year => SEASONS.map(season => './' + year + season + '.json');

const SEASON_PATHS = SEASONS.map(season => './' + YEAR + season + '.json');
// the filepath locations for storing fall and spring course data.
const FALL_PATH = SEASON_PATHS[0];
const SPRING_PATH = SEASON_PATHS[1];
const SUMMER1_PATH = SEASON_PATHS[2];
const SUMMERF_PATH = SEASON_PATHS[3];
const SUMMER2_PATH = SEASON_PATHS[4];
 
 /**
 * Grabs a file as JSON text.
 * @param {String} inputLocation The filepath of the input file to convert to JSON.
 * @returns {Promise} The resulting promise, resolved with the parsed JSON. 
 */
function getFileAsJson(inputLocation) {
  return new Promise(function(resolve, reject) {
    fs.readFile(inputLocation, (err, data) => {
      if (err) reject(err);
      try {
        let parsedJSON = JSON.parse(data);
        resolve(parsedJSON);
      } catch (err) {
        reject(err);
      }
    });
  });
}

 /**
 * Downloads a file from a specified link, to a specified filepath. Only downloads if file does not exist.
 * @param {String} url The url to download from.
 * @param {String} dest The destination file path.
 * @returns {Promise} The resulting promise, resolved with "Found" or "Downloaded". 
 */
const download = (url, dest) => new Promise(function(resolve, reject) {
  if (fs.existsSync(dest)) {
    // console.log("File " + dest + " found, skipping download.");
    resolve("Found");
  } else {
    // console.log("File " + dest + " not found, downloading from " + url);

    let file = fs.createWriteStream(dest);
    let request = https.get(url, function(response) {
      response.pipe(file);
      file.on('finish', function() {
        file.close(err => {
          if (err) reject(err);
          // console.log("Download complete.");
          resolve("Downloaded");
        });  // close() is async
      });
    }).on('error', function(err) { // Handle errors
      fs.unlink(dest); // Delete the file async. (But we don't check the result)
      reject(err);
    });
  }
});

/**
 * Downloads all the files for a specified year, and attaches the produced JSONS to an object.
 * @param {String} year the 4-digit year.
 * @param {Object} classMapParent The parent object to attach classMaps to, under property termId.
 * @returns {Promise} Whether or not the operation succeeded. "success" or "failure"
 */
let addClassMapsOfYear = function(year, classMapParent) {
  let links = getClassMapLinks(year);
  let paths = getClassMapFilePaths(year);
  
  // convert the above into an array of download calls.
  // assume they are the same length.
  let downloads = [];
  for (let i = 0; i < links.length; i += 1) {
    downloads.push(download(links[i], paths[i]));
  }

  // attempt to download everything
  return Promise.all(downloads)
  .then(results => {
    // if the download succeeds, then try and read everything as JSON
    let jsons = paths.map(path => getFileAsJson(path));
    return Promise.all(jsons);
  }, err => {
    // if the download fails, then log the error.
    // console.log("error downloading files");
    // console.log("err");
    return "failure";
  })
  .then(results => {
    // if reading as JSON succeeds, then add all the JSONS to parent classMap.
    results.forEach(function(item, index, arr) {
      let classMap = item;
      let termId = classMap.termId;
      classMapParent[termId] = classMap;
    });
    return "success";
  }, err => {
    // if reading stuff as JSON fails, then log the error
    // console.log("failed reading items as JSON");
    // console.log(err);
    return "failure";
  });
}

 /**
 * Produces the classMapParent object containing all classMap course information.
 * @returns {Promise} A promise, resolved with the classMapParent object.
 */
let loadClassMaps = () => {
  
  let classMapParent = {};
  let years = [2018, 2019];

  return Promise.all(years.map(year => addClassMapsOfYear(year, classMapParent)))
  .then(result => {
    // adds the most recent semester's termId as a property
    let maxYear = Math.max.apply(null, years);
    let maxSeason = Math.max.apply(null, SEASONS);
    classMapParent["mostRecentSemester"] = "" + maxYear + maxSeason;
    
    // adds all the termIds as a property (array form).
    let allTermIds = [];
    years.forEach(function(item, index, arr) {
      let year = item;
      SEASONS.forEach(function(item, index, arr) {
        let season = item;
        let termId = "" + year + season;
        allTermIds.push(termId);
      });
    });
    classMapParent["allTermIds"] = allTermIds;
    // ensure that they are sorted greatest => least.
    classMapParent.allTermIds.sort((a1, a2) => (a2 - a1));
    
    // success! now run the main code.
    return classMapParent;
  }, err => {
    // console.log("something went wrong with addClassMapsOfYear");
    // console.log(err);
  });
}

module.exports.loadClassMaps = loadClassMaps;