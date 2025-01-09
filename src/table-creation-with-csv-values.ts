/* The following piece of code generates a list of comma separated values (CSV) so that they can be consumed by https://www.becsv.com/csv-table.php to create a HTML table. */

const separator = '|';
const headers = [
    'Artist',
    'Title',
].join(separator);

const selector = 'h3';
const elements = Array.from(document.querySelectorAll(selector));

const lines = elements.map(element => {
    const value1 = '';
    const value2 = '';
    const value3 = '';
    const value4 = '';
    const value5 = '';
    
    const values = [
        value1,
    ].join(separator);

    return values;
});

lines.unshift(headers);
console.log(lines.join('\n'));

