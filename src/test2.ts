import * as selenium from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';

(async () => {
  const driver = await createDriver();
  let elements;

  await requestGet(driver, 'https://youtube.com/watch?v=R4k4N7pnVLw');
  await waitFor(3000);
  elements = await findElements(driver);
  if (elements === undefined) {
    console.log('undefined');
  } else {
    console.log(await Promise.all(elements.map(async (v) => v.getAttribute('href'))));
  }

  await requestGet(driver, 'https://youtube.com/watch?v=UTPnsbwBK30');
  await waitFor(3000);
  elements = await findElements(driver);
  if (elements === undefined) {
    console.log('undefined');
  } else {
    console.log(await Promise.all(elements.map(async (v) => v.getAttribute('href'))));
  }
})();

async function requestGet (driver: selenium.WebDriver, url: string) {
  try {
    await driver.get(url);
  } catch (e: any) {
    console.log(e.stack);
  }
}

async function findElements (driver: selenium.WebDriver) {
  try {
    return await driver.findElements(selenium.By.css('ytd-watch-next-secondary-results-renderer ytd-thumbnail a'));
  } catch (e: any) {
    console.log(e.stack);
  }
}

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
    console.log(e.stack);
    throw Error('createDriver failed');
  }
}

async function waitFor (ms: number) {
  await new Promise<void>((res) => {
    setTimeout(() => {
      res();
    }, ms);
  });
};
