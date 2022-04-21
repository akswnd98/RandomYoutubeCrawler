import PageRankMethod from '..';
import Operation from './Operation';

export type CurrentState = {
  hashIndexMap: HashIndexMap;
  indexHashMap: IndexHashMap;
  pageRankMethodCurrent: PageRankMethod;
};

export type IndexBaseMDPGraph = number[][];

export type HashIndexMap = Map<string, number>;

export type IndexHashMap = string[];

export default class HashAdapter {
  private currentState: CurrentState;

  constructor () {
    this.currentState = {
      hashIndexMap: new Map<string, number>(),
      indexHashMap: [],
      pageRankMethodCurrent: new PageRankMethod(),
    };
  }

  bindOperation (operation: Operation) {
    operation.bindAdapter(this.currentState);
  }
}