import * as selenium from 'selenium-webdriver';
import chrome, { Driver } from 'selenium-webdriver/chrome';
import chromedriver from 'chromedriver';
import dotenv from 'dotenv';
import HashAdapter from './CrawlingCurrent/PageRankMethod/HashAdapter';
import Init from './CrawlingCurrent/PageRankMethod/HashAdapter/Operation/Init';
import PrintAll from './CrawlingCurrent/PageRankMethod/HashAdapter/Operation/PrintAll';
import Expand from './CrawlingCurrent/PageRankMethod/HashAdapter/Operation/Expand';
import GetPageRankOperation from './CrawlingCurrent/PageRankMethod/HashAdapter/Operation/GetPageRank';

const nodes = [
  { id: 'hello' },
  { id: 'nice' },
  { id: 'owow' },
];

const edges = [
  { baseId: 'hello', relatedId: 'nice' },
  { baseId: 'hello', relatedId: 'owow' },
  { baseId: 'owow', relatedId: 'nice' },
];

(async () => {
  try {
    dotenv.config();
    const crawlingCurrent = new HashAdapter();
    const initOperation = new Init({ crawlingCurrent });
    initOperation.init({ nodes, edges });
    const expandOperation = new Expand({ crawlingCurrent });
    expandOperation.expand({
      edges: [
        { baseId: 'hello', relatedId: 'nice' },
        { baseId: 'nice', relatedId: 'hello' },
        { baseId: 'owow', relatedId: 'nice' },
      ],
    });
    const printAllOperation = new PrintAll({ crawlingCurrent });
    printAllOperation.printAll();
    const getPageRankOperation = new GetPageRankOperation({ crawlingCurrent });
    console.log(getPageRankOperation.getPageRank());
  } catch (e) {
    console.log(e);
  }
})();

// (async () => {
//   try {
//     dotenv.config();
//     await initChromeService();
//     const driver = await createDriver();
//     const start = Date.now();
//     const lists = await getLimitedRelatedLinks(driver, 'https://www.youtube.com/watch?v=hWEHcSpoTKE', 10);
//     const end = Date.now();
//     console.log(lists);
//     console.log(`${(end - start) / 1000} 초`);
    
//   } catch (e) {
//     console.log(e);
//   }
// })();

async function initChromeService () {
  const service = new chrome.ServiceBuilder(chromedriver.path).build();
  chrome.setDefaultService(service);
}

async function createDriver () {
  const options = new chrome.Options();
  options.addArguments(
    '--headless',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--single-process',
  );
  return await new selenium.Builder().forBrowser('chrome').setChromeOptions(options).build();
}
