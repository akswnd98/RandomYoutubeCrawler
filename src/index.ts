import * as selenium from 'selenium-webdriver';
import chrome, { Driver } from 'selenium-webdriver/chrome';
import chromedriver from 'chromedriver';
import dotenv from 'dotenv';
import NegativePageRankExpander from './MultiExpander/NegativePageRankExpander';
import HashAdapter from './CrawlingCurrent/PageRankMethod/Graph/HashAdapter';
import VisitMap from './CrawlingCurrent/PageRankMethod/VisitMap';
import InitGraphOperation from './CrawlingCurrent/PageRankMethod/Graph/HashAdapter/Operation/Init';
import InitVisitMapOperation from './CrawlingCurrent/PageRankMethod/VisitMap/Operation/Init';
import winstonLogger from './winstonLogger';
import Selector from './Selector';
import GetPageRankOperation from './CrawlingCurrent/PageRankMethod/Graph/HashAdapter/Operation/GetPageRank';
import CheckIsVisitOperation from './CrawlingCurrent/PageRankMethod/VisitMap/Operation/CheckIsVisit';
import ExpandGraphOperation from './CrawlingCurrent/PageRankMethod/Graph/HashAdapter/Operation/Expand';
import ExpandVisitMapOperation from './CrawlingCurrent/PageRankMethod/VisitMap/Operation/Expand';
import Crawler from './Crawler';

const initialGraph = {
  nodes: [
    {
      id: '5bXl_WA-djM',
    }, {
      id: 'Y7r2znabAEQ',
    }
  ],
  edges: [],
};

const initialVisitMap = {
  nodes: [
    {
      id: '5bXl_WA-djM',
      visit: false,
    }, {
      id: 'Y7r2znabAEQ',
      visit: false,
    },
  ],
};

(async () => {
  try {
    dotenv.config();
    await initChromeService();
    const driver = await createDriver();
    const graphCurrent = new HashAdapter();
    const visitMapCurrent = new VisitMap();
    new InitGraphOperation({ graphCurrent }).init(initialGraph);
    new InitVisitMapOperation({ visitMapCurrent }).init(initialVisitMap);
    const getPageRankOperation = new GetPageRankOperation({ graphCurrent });
    const checkIsVisitOperation = new CheckIsVisitOperation({ visitMapCurrent });
    const expandGraphOperation = new ExpandGraphOperation({ graphCurrent });
    const expandVisitMapOperation = new ExpandVisitMapOperation({ visitMapCurrent });
    const selector = new Selector({ getPageRankOperation, checkIsVisitOperation });
    const crawler = new Crawler({ driver });
    const expander = new NegativePageRankExpander({
      expandGraphOperation,
      expandVisitMapOperation,
    });
    let step = 0;
    let timeDiff = Date.now();
    while (1) {
      console.log(`step: ${step}`);
      const selectedIds = selector.select();
      const newEdges = await crawler.crawl(selectedIds);
      await expander.expand({ edges: newEdges });
      console.log((Date.now() - timeDiff) / 1000);
      timeDiff = Date.now();
      step++;
    }
  } catch (e) {
    winstonLogger.error(e);
  }
})();

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
