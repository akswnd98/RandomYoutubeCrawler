import HashAdapter, { CurrentState } from '..';
import PageRankMethod from '../..';

export type ConstructorParam = {
  graphCurrent: HashAdapter;
};

export default class Operation {
  protected currentState!: CurrentState;

  constructor (payload: ConstructorParam) {
    payload.graphCurrent.bindOperation(this);
  }

  bindAdapter (currentState: CurrentState) {
    this.currentState = currentState;
  }
}
