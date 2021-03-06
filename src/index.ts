import * as selenium from 'selenium-webdriver';
import chrome, { Driver } from 'selenium-webdriver/chrome';
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
import Crawler from './Crawler';
import SetVisitOperation from './CrawlingCurrent/PageRankMethod/VisitMap/Operation/Set';
import MultiVisitSetter from './MultiVisitSetter';

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
    const setVisitOperation = new SetVisitOperation({ visitMapCurrent });

    const initializer = new Initializer({ initGraphOperation, initVisitMapOperation });
    const selector = new Selector({ getPageRankOperation, checkIsVisitOperation });
    const visitSetter = new MultiVisitSetter({ setVisitOperation });
    const crawler = new Crawler({ waitMs: process.env.PAGE_ENTER_WAIT_MS, driver });
    const expander = new NegativePageRankExpander({ expandGraphOperation });

    await initializer.init();
  
    let step = 0;
    let timeDiff = Date.now();
    while (1) {
      winstonLogger.info(`step: ${step}`);
      const selectedIds = selector.select();
      await visitSetter.set({nodes: selectedIds.map((v) => ({ id: v })) });
      winstonLogger.info(`????????? ????????? ???: ${selectedIds.length}???`);
      const newEdges = await crawler.crawl(selectedIds);
      winstonLogger.info(`???????????? id ???: ${newEdges.length}???`);
      await expander.expand({ edges: newEdges });
      winstonLogger.info(`?????? ??????: ${(Date.now() - timeDiff) / 1000}???`);
      timeDiff = Date.now();
      step++;
    }
  } catch (e: any) {
    winstonLogger.error(e.stack);
  }
})();

async function initChromeService () {
  const service = new chrome.ServiceBuilder(process.env.CHROMEDRIVER_PATH).build();
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
    options.setChromeBinaryPath(process.env.CHROME_PATH);
    return await new selenium.Builder().forBrowser('chrome').setChromeOptions(options).build();
  } catch (e: any) {
    winstonLogger.error(e.stack);
    throw Error('createDriver failed');
  }
}
