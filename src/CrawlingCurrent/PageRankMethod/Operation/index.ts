import PageRankMethod, { CurrentState } from '..';

export type ConstructorParam = {
  crawlingCurrent: PageRankMethod;
};

export default class Operation {
  protected currentState!: CurrentState;

  constructor (payload: ConstructorParam) {
    payload.crawlingCurrent.bindOperation(this);
  }

  bindCrawlingCurrent (currentState: CurrentState) {
    this.currentState = currentState;
  }
}
