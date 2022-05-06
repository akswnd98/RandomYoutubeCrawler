import * as selenium from 'selenium-webdriver';
import chrome, { Driver } from 'selenium-webdriver/chrome';
import chromedriver from 'chromedriver';
import dotenv from 'dotenv';
import NegativePageRankExpander from './MultiExpander/NegativePageRankExpander';
import HashAdapter from './CrawlingCurrent/PageRankMethod/Graph/HashAdapter';
import VisitMap from './CrawlingCurrent/PageRankMethod/VisitMap';
import Initializer from './CrawlingCurrent/PageRankMethod/Initializer';
import winstonLogger from './winstonLogger';
import Selector from './Selector';
import InitGraphOperation from './CrawlingCurrent/PageRankMethod/Graph/HashAdapter/Operation/Init';
import InitVisitMapOperation from './CrawlingCurrent/PageRankMethod/VisitMap/Operation/Init';
import GetPageRankOperation from './CrawlingCurrent/PageRankMethod/Graph/HashAdapter/Operation/GetPageRank';
import CheckIsVisitOperation from './CrawlingCurrent/PageRankMethod/VisitMap/Operation/CheckIsVisit';
import ExpandGraphOperation from './CrawlingCurrent/PageRankMethod/Graph/HashAdapter/Operation/Expand';
import ExpandVisitMapOperation from './CrawlingCurrent/PageRankMethod/VisitMap/Operation/Expand';
import Crawler from './Crawler';

// initial ytId: 5bXl_WA-djM, Y7r2znabAEQ

(async () => {
  try {
    dotenv.config();
    await initChromeService();
    const driver = await createDriver();

    const graphCurrent = new HashAdapter();
    const visitMapCurrent = new VisitMap();

    const initGraphOperation = new InitGraphOperation({ graphCurrent });
    const initVisitMapOperation = new InitVisitMapOperation({ visitMapCurrent });
    const getPageRankOperation = new GetPageRankOperation({ graphCurrent });
    const checkIsVisitOperation = new CheckIsVisitOperation({ visitMapCurrent });
    const expandGraphOperation = new ExpandGraphOperation({ graphCurrent });
    const expandVisitMapOperation = new ExpandVisitMapOperation({ visitMapCurrent });

    const initializer = new Initializer({ initGraphOperation, initVisitMapOperation });
    const selector = new Selector({ getPageRankOperation, checkIsVisitOperation });
    const crawler = new Crawler({ driver });
    const expander = new NegativePageRankExpander({ expandGraphOperation, expandVisitMapOperation });

    await initializer.init();
  
    let step = 0;
    let timeDiff = Date.now();
    while (1) {
      winstonLogger.info(`step: ${step}`);
      const selectedIds = selector.select();
      winstonLogger.info(`크롤링 페이지 수: ${selectedIds.length}개`);
      const newEdges = await crawler.crawl(selectedIds);
      await expander.expand({ edges: newEdges });
      winstonLogger.info(`경과 시간: ${(Date.now() - timeDiff) / 1000}초`);
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
  try {
    const options = new chrome.Options();
    options.addArguments(
      '--headless',
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--single-process',
    );
    return await new selenium.Builder().forBrowser('chrome').setChromeOptions(options).build();
  } catch (e) {
    winstonLogger.error(e);
    throw Error('createDriver failed');
  }
}
