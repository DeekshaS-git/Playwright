const XLSX = require('xlsx');

function getTestData(sheetName) {
    const workbook = XLSX.readFile('./test-data/loginData.xlsx');

    const worksheet = workbook.Sheets[sheetName];

    return XLSX.utils.sheet_to_json(worksheet);
}

module.exports = {
    getTestData
};