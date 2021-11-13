const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const fs = require("fs/promises");
const objectsToCsv = require("objects-to-csv");

const microFocusUrl ='https://www.microfocus.com/productlifecycle/';

async function productInfo(page){
    await page.goto(microFocusUrl);
    const html = await page.content();
    const $ = cheerio.load(html);
    const regexForId = /[0-9]*/g;
    const idExtractor = input => {
        return input.match(regexForId).filter(item => item !== "").toString();
    }
    const idArray = [];
    const tableRowElem = $("div > table.table_products > tbody > tr");
    for(let i=1; i< tableRowElem.length; i++) {
        // const productName = $(tableRowElem[i]).find("td:nth-child(2)").text();
        // const productFullId = $(tableRowElem[i]).attr("id");
        const productId = idExtractor($(tableRowElem[i]).attr("id"));
        // results.push({productName, productFullId, productId});
        idArray.push(productId);
    }
    return idArray;
}

async function createCsvFile(data) {
    let csv = new objectsToCsv(data);
    await csv.toDisk("./mfprodID7.csv");
}

function convertToArrayOfObj(inArr) {
    let modifArr = []
    for(let id of inArr){
        modifArr.push({id})
    }
    return modifArr
}

async function main(){
    const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage();
    const productInfoResults = await productInfo(page);
    const newArr = [...new Set(productInfoResults)];
    // const httpRequestResults = await collectLifeCycle(productInfoResults, page);
    // console.log(productInfoResults);
    const newArrId = convertToArrayOfObj(newArr)
    await createCsvFile(newArrId);
}

// var itr = new Iterator(list)

main();