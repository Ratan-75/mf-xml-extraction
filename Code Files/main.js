const { xml } = require('cheerio/lib/static');
const https = require('https');
const xml2js = require('xml2js');

const constURL = 'https://www.microfocus.com/productlifecycle/lifecycle_subrows.jsp';

async function main(){
    var options = {
        'method': 'GET',
        'agentOptions': {
          rejectUnauthorized: false
        },
        'port' : 22,
        'url': constURL + '?' +'lt_id=' + '359' + '&' + 'parent_ids=' + '359',
        'headers': {
          'Cookie': 'JSESSIONID-PUBLICWEBAN=0000xtGltewpAlQyGRBtU8koxUu:18fcg9hqk; ZNPCQ003-32343600=87afba1c'
        }
      };

    https
        .get(options,
        (resp) => {
            let data = '';
            resp.on('data', (chunk) => {
                data += chunk;
            });
            
            resp.on('end', () => {
                console.log(data);
                // convert data
            });
        }
    )
    .on('error', (err) => {
        console.log('Encountered an error in https GET resquest: ' + err.message);
    });
}

main();

// function convert(data)[
//     var parser = new xml2js.Parser();
// ]


