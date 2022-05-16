import * as selenium from 'selenium-webdriver';
import { waitFor } from './util';
import winstonLogger from '../winstonLogger';

export type ConstructorParam = {
  waitMs: number;
  driver: selenium.WebDriver;
};

export type Edge = {
  baseId: string;
  relatedId: string;  
};

export default class Crawler {
  private static MAX_RELATED_NUM = 20;

  private waitMs = 3000;

  private driver: selenium.WebDriver;

  constructor (payload: ConstructorParam) {
    this.driver = payload.driver;
    this.waitMs = payload.waitMs;
  }

  async crawl (selectedIds: string[]) {
    const ret: Edge[] = [];
    for (let i = 0; i < selectedIds.length; i++) {
      const links = await this.getLimitedRelatedLinks(`https://youtube.com/watch?v=${selectedIds[i]}`, Crawler.MAX_RELATED_NUM);
      links.forEach((v) => {
        ret.push({ baseId: selectedIds[i], relatedId: v });
      });
    }
    return ret;
  }

  private async getLimitedRelatedLinks (url: string, maxNum: number) {
    const links = await this.getRelatedLinks(url);
    return links.slice(0, Math.min(maxNum, links.length));
  }

  private async getRelatedLinks (url: string) {
    try {
      await this.requestGet(url);
      await waitFor(this.waitMs);
      const elements = await this.findRelatedElements(url);
      const links = await Promise.all(elements.map(async (v) => {
        try {
          return this.trimToId(await v.getAttribute('href'));
        } catch (e: any) {
          winstonLogger.error(e.stack);
          return undefined;
        }
      }));
      const ret: string[] = [];
      links.forEach((v) => {
        if (v !== undefined) ret.push(v);
      });
      return ret;
    } catch (e: any) {
      winstonLogger.error(e.stack);
      winstonLogger.error(`getRelatedLinks failed: ${url}`);
      return [];
    }
  };

  async requestGet (url: string) {
    try {
      await this.driver.get(url);
    } catch (e: any) {
      winstonLogger.error(e.stack);
      throw Error(`requestGet failed: ${url}`);
    }
  }

  async findRelatedElements (url: string) {
    try {
      return await this.driver.findElements(selenium.By.css('ytd-watch-next-secondary-results-renderer ytd-thumbnail a'));
    } catch (e: any) {
      winstonLogger.error(e.stack);
      throw Error(`findRelatedElements: ${url}`);
    }
  }

  private trimToId (url: string) {
    let matched = /[\?\&]v\=.*/.exec(url)!.at(0)?.substring(3);
    if (matched === undefined) throw new Error(`trimToUrl failed: ${url}`);
    const searchAnd = matched.search('&');
    const lastIdx = searchAnd < 0 ? matched.length : searchAnd;
    matched = matched.substring(0, lastIdx);
    return matched;
  }
}
