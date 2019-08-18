# GraduateNU

An automatic plan builder utilizing your current degree audit information to help you graduate.

Dependencies:
- Node.js

To run:

- Download your degree audit from the Northeastern MyPAWS degree audit system. Do this by clicking the 'printer-friendly' mode, then right-clicking the page and/or using a command line tool of your choice to obtain the degree audit file. Ensure that the file name is 'Web\ Audit.html' and that it is located in this repository's file system.
- Execute the command ``` node html_parser.js ```
- Execute ``` node json_parser.js ```

After this, an organized JSON file with information regarding your current degree trajectory should be present in the produced ``` schedule.json ``` file.

In the future, this functionality will comprise a portion of the backend of a web application designed to facilitate the simple creation of schedules via a degree audit and/or supplemental information provided by the end user.

### parse_audit.js

Expects a "Web Audit.html" degree audit, downloaded directly from the Northeastern website. 
Produces a schedule in JSON format.

### parser.js

Expects a sampleData.json file in the JSON object format specified in the parser_funcs.js file. 
Produces a schedule.json file, with classes sorted by time taken (season, year). 
