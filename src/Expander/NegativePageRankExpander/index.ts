import Expander from '..';
import PageRankMethod from '../../CrawlingCurrent/PageRankMethod/Graph/HashAdapter';
import ExpandGraphOperation from '../../CrawlingCurrent/PageRankMethod/Graph/HashAdapter/Operation/Expand';
import GetPageRankOperation from '../../CrawlingCurrent/PageRankMethod/Graph/HashAdapter/Operation/GetPageRank';
import VisitMap from '../../CrawlingCurrent/PageRankMethod/VisitMap';
import CheckIsVisitOperation from '../../CrawlingCurrent/PageRankMethod/VisitMap/Operation/CheckIsVisit';
import ExpandVisitMapOperation from '../../CrawlingCurrent/PageRankMethod/VisitMap/Operation/Expand';
import * as selenium from 'selenium-webdriver';
import { waitFor } from './util';
import winstonLogger from '../../winstonLogger';
import NodeModel from '@/src/db/Node';
import EdgeModel from '@/src/db/Edge';

export type ConstructorParam = {
  driver: selenium.WebDriver;
  graphCurrent: PageRankMethod;
  visitMapCurrent: VisitMap;
};

export type Edge = {
  baseId: string;
  relatedId: string;  
};

export default class NegativePageRankExpander extends Expander {
  static MAX_SELECT_RATE = 0.001;
  static MAX_RELATED_NUM = 20;

  private driver: selenium.WebDriver;
  private graphCurrent: PageRankMethod;
  private visitMapCurrent: VisitMap;
  private expandGraphOperation: ExpandGraphOperation;
  private getPageRankOperation: GetPageRankOperation;
  private expandVisitMapOperation: ExpandVisitMapOperation;
  private checkIsVisitOperation: CheckIsVisitOperation;

  constructor (payload: ConstructorParam) {
    super();
    this.driver = payload.driver;
    this.graphCurrent = payload.graphCurrent;
    this.visitMapCurrent = payload.visitMapCurrent;
    this.expandGraphOperation = new ExpandGraphOperation({ graphCurrent: this.graphCurrent });
    this.getPageRankOperation = new GetPageRankOperation({ graphCurrent: this.graphCurrent });
    this.expandVisitMapOperation = new ExpandVisitMapOperation({ visitMapCurrent: this.visitMapCurrent });
    this.checkIsVisitOperation = new CheckIsVisitOperation({ visitMapCurrent: this.visitMapCurrent });
  }

  async expandOneStep () {
    try {
      const newEdges = await this.crawlRelated(this.selectIds());
      this.expandGraphOperation.expand({ edges: newEdges });
      this.expandVisitMapOperation.expand({ edges: newEdges });
      // await this.saveToDB(newEdges);
    } catch (e) {

    }
  }

  selectIds () {
    const rank = this.getPageRankOperation.getPageRank();
    const rankSort = Array.from(rank.entries()).sort((a, b) => a[1] - b[1]);
    const selectedIds = [];
    for (let i = 0, j = 0; i < rankSort.length && j < rankSort.length * NegativePageRankExpander.MAX_SELECT_RATE; i++) {
      if (!this.checkIsVisitOperation.checkIsVisit({ id: rankSort[i][0] })) {
        selectedIds.push(rankSort[i][0]);
        j++;
      }
    }
    return selectedIds;
  }

  async crawlRelated (selectedIds: string[]) {
    const ret: Edge[] = [];
    for (let i = 0; i < selectedIds.length; i++) {
      const links = await this.getLimitedRelatedLinks(this.driver, `https://youtube.com/watch?v=${selectedIds[i]}`, NegativePageRankExpander.MAX_RELATED_NUM);
      links.forEach((v) => {
        ret.push({ baseId: selectedIds[i], relatedId: v });
      });
    }
    return ret;
  }

  async saveToDB (newEdges: Edge[]) {
    const newNodes = this.getNewNodeIds(newEdges).map((v) => ({ ytId: v, visit: false }));
    try {
      await NodeModel.bulkCreate(newNodes);
      await EdgeModel.bulkCreate(newEdges);
    } catch (e) {
      console.log(e);
    }
  }

  async getLimitedRelatedLinks (driver: selenium.WebDriver, url: string, maxNum: number) {
    const links = await this.getRelatedLinks(driver, url);
    return links.slice(0, Math.min(maxNum, links.length));
  }

  async getRelatedLinks (driver: selenium.WebDriver, url: string) {
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

  trimToId (url: string) {
    let matched = /[\?\&]v\=.*/.exec(url)!.at(0)?.substring(3);
    if (matched === undefined) throw new Error(`trimToUrl failed: ${url}`);
    const searchAnd = matched.search('&');
    const lastIdx = searchAnd < 0 ? matched.length : searchAnd;
    matched = matched.substring(0, lastIdx);
    return matched;
  }

  getNewNodeIds (newEdges: Edge[]) {
    let ret: string[] = [];
    newEdges.forEach((v) => {
      if (!this.checkIsVisitOperation.checkIsVisit({ id: v.relatedId })) {
        ret.push(v.relatedId);
      }
    });
    return ret;
  }
}
