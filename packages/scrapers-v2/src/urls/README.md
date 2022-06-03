# URL scraper

This folder contains code for scraping the URLs of entries in the catalog, and is based on the sidebar _hierarchy_ that the catalog uses to describe the locations of catalog entries. 

You can think of the catalog sidebar as a bunch of entries, with each entry potentially containing more sub-entries (hence _hierarchical_ in nature).

## Scraping Strategy

We hardcode a set of "top level entries" to scrape, which are the colleges. They are listed underneath [undergraduate](https://catalog.northeastern.edu/undergraduate/), and are just the colleges: CAMD, D'Amore McKim, Khoury, COE, Bouvé, COE, and CSSH.
 
When you click on one of the colleges above, (from the undergraduate link) you can see the sidebar will expand, with more entries. We then add all of these sub-entries to a queue of links to visit, and begin by visiting the first (think, BFS).

Visiting the first one, "School of Architecture" (under CAMD), we see it yields more links. Rinse and repeat the above process. Visiting the first of these, we see that this time, it does _not_ yield more sub-links. Therefore, we have a "leaf" of the hierarchy "tree", and we store the link to this entry.

## Misc

When actually scraping, we just store a list of paths (each path to a catalog entry). However because of the hierarchical nature of the catalog, we figured it may be useful to later be able to have a hierarchy, so we convert it to be a hierarchy.

Maybe in the future this is used, or maybe it is not needed and can be removed.

## Support for old catalogs

All the old catalogs can be found here: https://registrar.northeastern.edu/group/academic-catalogs/

However, only the last ~7 or so catalogs are actually stored in HTML form. we don't know if earlier versions were in HTML at one point, but the server was taken offline, or if there was only ever a PDF of the catalog available.

Because of this, in the future, it may be worth it to download old versions of the catalog for safekeeping.

Also because of this, we cannot scrape older versions of the catalog (older than 7 years), because the scraper cannot function on non-HTML versions of the catalog. 

The ticket for adding old catalog support can be found here: https://trello.com/c/7aFTWtMU/452-scrapers-add-old-catalog-support