import * as selenium from 'selenium-webdriver';
import { waitFor } from './util';

export async function getLimitedRelatedLinks (driver: selenium.WebDriver, url: string, maxNum: number) {
  const links = await getRelatedLinks(driver, url);
  return links.slice(0, Math.min(maxNum, links.length));
};

export async function getRelatedLinks (driver: selenium.WebDriver, url: string) {
  await driver.get(url);
  await waitFor(2000);
  const elements = await driver.findElements(selenium.By.css('ytd-watch-next-secondary-results-renderer ytd-compact-video-renderer ytd-thumbnail a'));
  return await Promise.all(elements.map((v) => v.getAttribute('href')));
};
