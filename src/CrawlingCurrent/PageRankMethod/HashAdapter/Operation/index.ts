import HashAdapter, { CurrentState } from '..';
import PageRankMethod from '../..';

export type ConstructorParam = {
  crawlingCurrent: HashAdapter;
};

export default class Operation {
  protected currentState!: CurrentState;

  constructor (payload: ConstructorParam) {
    payload.crawlingCurrent.bindOperation(this);
  }

  bindAdapter (currentState: CurrentState) {
    this.currentState = currentState;
  }
}
