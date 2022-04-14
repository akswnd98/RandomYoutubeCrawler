import * as selenium from 'selenium-webdriver';
import chrome, { Driver } from 'selenium-webdriver/chrome';
import chromedriver from 'chromedriver';
import { getLimitedRelatedLinks } from './parser';
import dotenv from 'dotenv';

(async () => {
  try {
    dotenv.config();
    await initChromeService();
    const driver = await createDriver();
    console.log(await getLimitedRelatedLinks(driver, 'https://www.youtube.com/watch?v=Zd3fs5n8zW4', 5));
  } catch (e) {
    console.log(e);
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
