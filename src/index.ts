import * as selenium from 'selenium-webdriver';
import chrome, { Driver } from 'selenium-webdriver/chrome';
import chromedriver from 'chromedriver';
import dotenv from 'dotenv';
import NegativePageRankExpander from './Expander/NegativePageRankExpander';
import HashAdapter from './CrawlingCurrent/PageRankMethod/Graph/HashAdapter';
import VisitMap from './CrawlingCurrent/PageRankMethod/VisitMap';
import InitGraphOperation from './CrawlingCurrent/PageRankMethod/Graph/HashAdapter/Operation/Init';
import InitVisitMapOperation from './CrawlingCurrent/PageRankMethod/VisitMap/Operation/Init';
import PrintAllGraphOperation from './CrawlingCurrent/PageRankMethod/Graph/HashAdapter/Operation/PrintAll';
import PrintAllVisitOperation from './CrawlingCurrent/PageRankMethod/VisitMap/Operation/PrintAll';
import winstonLogger from './winstonLogger';
import winston from 'winston';
import path from 'path';
import GetAllVisitOperation from './CrawlingCurrent/PageRankMethod/VisitMap/Operation/GetAll';

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
    const printAllVisitOperation = new PrintAllVisitOperation({ visitMapCurrent });
    const getAllVisitOperation = new GetAllVisitOperation({ visitMapCurrent });
    new InitGraphOperation({ graphCurrent }).init(initialGraph);
    new InitVisitMapOperation({ visitMapCurrent }).init(initialVisitMap);
    const expander = new NegativePageRankExpander({
      driver,
      graphCurrent,
      visitMapCurrent,
    });
    let step = 0;
    let timeDiff = Date.now();
    while (1) {
      console.log(`step: ${step}`);
      winstonLogger
        .clear()
        .add(new winston.transports.File({ filename: path.resolve(__dirname, `../log/error_${step}.log`), level: 'error' }))
        .add(new winston.transports.File({ filename: path.resolve(__dirname, `../log/info_${step}.log`), level: 'info' }))
      await expander.expandOneStep();
      winstonLogger.info(getAllVisitOperation.getAll());
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
