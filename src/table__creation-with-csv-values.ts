/* The following piece of code generates a list of comma separated values (CSV) from a HTML file. This list is then consumed by https://www.becsv.com/csv-table.php to create a HTML table. */

const headers = [
    'Artist',
    'Title',
];

const selector = 'h3';

const separator = '|';
const elements = [...document.querySelectorAll(selector)];

const lines = elements.map(element => {
    const value1 = '';
    // const value2 = '';
    // const value3 = '';
    // const value4 = '';
    // const value5 = '';
    
    const values = [
        value1
    ];

    const error = values.length !== headers.length;
    
    if (error) {
        throw Error('The number of table headers do not match with the number of table cells.');
    }

    return values.join(separator);
});

lines.unshift(headers.join(separator));

console.log(lines.join('\n'));