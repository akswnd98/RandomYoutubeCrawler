import * as selenium from 'selenium-webdriver';
import { waitFor } from './util';
import winstonLogger from '../winstonLogger';

export type ConstructorParam = {
  driver: selenium.WebDriver;
};

export type Edge = {
  baseId: string;
  relatedId: string;  
};

export default class Crawler {
  private static MAX_RELATED_NUM = 20;

  private driver: selenium.WebDriver;

  constructor (payload: ConstructorParam) {
    this.driver = payload.driver;
  }

  async crawl (selectedIds: string[]) {
    const ret: Edge[] = [];
    for (let i = 0; i < selectedIds.length; i++) {
      const links = await this.getLimitedRelatedLinks(this.driver, `https://youtube.com/watch?v=${selectedIds[i]}`, Crawler.MAX_RELATED_NUM);
      links.forEach((v) => {
        ret.push({ baseId: selectedIds[i], relatedId: v });
      });
    }
    return ret;
  }

  private async getLimitedRelatedLinks (driver: selenium.WebDriver, url: string, maxNum: number) {
    const links = await this.getRelatedLinks(driver, url);
    return links.slice(0, Math.min(maxNum, links.length));
  }

  private async getRelatedLinks (driver: selenium.WebDriver, url: string) {
    try {
      await driver.get(url);
      await waitFor(3000);
      const elements = await driver.findElements(selenium.By.css('ytd-watch-next-secondary-results-renderer ytd-thumbnail a'));
      const links = await Promise.all(elements.map(async (v) => {
        try {
          return this.trimToId(await v.getAttribute('href'));
        } catch (e) {
          return undefined;
        }
      }));
      const ret: string[] = [];
      links.forEach((v) => {
        if (v !== undefined) ret.push(v);
      });
      return ret;
    } catch (e) {
      winstonLogger.error(`getRelatedLinks failed: ${url}`);
      return [];
    }
  };

  private trimToId (url: string) {
    let matched = /[\?\&]v\=.*/.exec(url)!.at(0)?.substring(3);
    if (matched === undefined) throw new Error(`trimToUrl failed: ${url}`);
    const searchAnd = matched.search('&');
    const lastIdx = searchAnd < 0 ? matched.length : searchAnd;
    matched = matched.substring(0, lastIdx);
    return matched;
  }
}
