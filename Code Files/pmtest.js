const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
var request = require('request');
const xml2js = require('xml2js');
const objectsToCsv = require("objects-to-csv");

// let LifecyclePlugin = require('../../plugins-core/LifecyclePlugin.js')

// var plugin = new LifecyclePlugin('microfocus','microfocus',run);
// plugin.register();

async function createCsvFile(data) {
  let csv = new objectsToCsv(data);
  await csv.toDisk("./micro_focus_batch_three.csv");
}

function convert(data){
  let convertedData;
  var parser = new xml2js.Parser();
  parser.parseString(data, function(err, result){
    convertedData = result;
  });
  return convertedData;
}

const toPushList = [];

const microFocusUrl ='https://www.microfocus.com/productlifecycle/';

const constURL = 'https://www.microfocus.com/productlifecycle/lifecycle_subrows.jsp';

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
  for(let i=1; i < tableRowElem.length; i++) {
      // const productName = $(tableRowElem[i]).find("td:nth-child(2)").text();
      // const productFullId = $(tableRowElem[i]).attr("id");
      const productId = idExtractor($(tableRowElem[i]).attr("id"));
      idArray.push(productId);
  }
  return idArray;
}

async function requrestForLC(prodId){
  var options = {
    'method': 'GET',
    'agentOptions': {
      rejectUnauthorized: false
    },
    'url': constURL + '?' +'lt_id=' + prodId + '&' + 'parent_ids=' + prodId,
    'headers': {
      'Cookie': 'JSESSIONID-PUBLICWEBAN=0000xtGltewpAlQyGRBtU8koxUu:18fcg9hqk; ZNPCQ003-32343600=87afba1c'
    }
  };

  return new Promise((resolve, reject) => {
    request(options, function (error, response) {
      if (error) throw new Error(error);
      resolve(convert(response.body));
    })
  })
}

async function extractor(resp){

  let rslt = resp;

  const regexForVersion = /(19|20)\d{2}|[0-9]*\.\S|\d/g;
  const regexForName = /[A-Z][0-9][a-z]*|[A-Z][0-9]|[A-Z][0-9][A-Z]|[0-9][a-z]+|[A-Z][a-z]*/g;

  const versionExtractor = input => {
    return input.match(regexForVersion).join('').toString();
  }

  const productNameExtractor = input => {
    return input.match(regexForName).join('').toString();
  }

  const covertDate = dateString => {
    if(dateString === " "){return "";}
    let date = new Date(dateString);
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let day = date.getDate();
    return (year + '-' + ((month <= 9) ? ('0' + month) : month) + '-' + ((day <= 9) ? ('0' + day) : day));
  }

  const iterationLength = rslt.response.product.length;
  for(let i=0; i < iterationLength; i++){
    let source_publisher = "Micro Focus";
    let product_version_name = rslt.response.product[i].$.service_pack;
    let source_product = productNameExtractor(product_version_name);
    let source_full_version = versionExtractor(product_version_name);
    let concatenated_source = source_publisher + ' - ' +  source_product + ' - ' + source_full_version;
    let source_availability = covertDate(rslt.response.product[i].$.fcs);
    let source_end_of_support = covertDate(rslt.response.product[i].$.Committed_ends);
    // const extendedSupportPlus = covertDate(rslt.response.product[i].$.Extended_ends);
    toPushList.push({concatenated_source, source_publisher, source_product, source_full_version, source_availability, source_end_of_support})
  }
}

async function sleep(milliseconds){
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function run(){
  const browser = await puppeteer.launch({headless:false});
  const page = await browser.newPage();

  const productInfoResults = await productInfo(page);

  const newArr = [...new Set(productInfoResults)].slice(200, 300);

  await browser.close();

  for(let item of newArr){
    const result = await requrestForLC(item);
    console.log(item);
    if(result.response == "\n\n"){
      continue;
    }else{
      try{
        await extractor(result);
        await sleep(Math.ceil(Math.random() * 2) * 1000);
      }catch(error){
        continue;
      }
    }
  }
  await createCsvFile(toPushList);
  // console.log(toPushList.length);
  // plugin.setExtractedLifeycleList(toPushList, () => {console.log('Push Complete!')});
}

run();
// exports[plugin.exportName] = plugin;
