let date = '    02 Mar 2017';

function formatDate(dateString) {
    let trimmedString = dateString.trim();
    if(trimmedString === ""){
        return "";
    }
    if(trimmedString === "-") {
        return "";
    }
    let dateArray = trimmedString.split(" ");
    let date = new Date(trimmedString);
    let month = date.getMonth() + 1;
    let day = dateArray[0];
    let year = dateArray[2];
    return (year + "-" + (((month <= 9) ? ('0' + month) : month)) + "-" + day);
}



console.log(formatDate(date));

async function delay(time){
    return new Promise(resolve => setTimeout(resolve, time));
}

async function clickFunction(page) {
    await page.goto("https://www.microfocus.com/productlifecycle/?term=AccuRev");
    
    const clickElem = await page.$$(".arrow");

    // await page.waitForSelector(".arrow");

    // await page.$$eval(".arrow", elem => elem.click());
    
    for(let x of clickElem){
        await x.click();
    }
    page.waitForTimeout(200);
    return page.content();
}

 async function scrapingFunction(html){
    const microFocusLC = [];
    const $ = cheerio.load(html);
    
    const tableELem = $(".sub_row");
    const innerTable = $(tableELem).find("td > div > table > tbody > tr");

    for(let j=0; j<innerTable.length; j++){
        const productNameWithVersion = $(innerTable[j]).find("td:nth-child(1)").text().trim();
        const releaseDate = $(innerTable[j]).find("td:nth-child(2)").text().trim();
        const committedSupportEnds = $(innerTable[j]).find("td:nth-child(3)").text().trim();
        const extendedSupportPlus = $(innerTable[j]).find("td:nth-child(4)").text().trim();
        microFocusLC.push({productNameWithVersion, releaseDate, committedSupportEnds, extendedSupportPlus});
    }
    return microFocusLC;
 }
    
async function main(){
    const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage();
    const html = await clickFunction(page);
    const results = await scrapingFunction(html);
    console.log(results);
}

// main();