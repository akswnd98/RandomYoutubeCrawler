import Operation, { ConstructorParam as ParentConstructorParam } from '..';
import GetPageRankOperation from '../../../Operation/GetPageRank';

export type ConstructorParam = {
} & ParentConstructorParam;

export default class GetPageRank extends Operation {
  private getPageRankOperation: GetPageRankOperation;

  constructor (payload: ConstructorParam) {
    super(payload);
    this.getPageRankOperation = new GetPageRankOperation({ crawlingCurrent: this.currentState.pageRankMethodCurrent });
  }

  getPageRank () {
    const ret = new Map<string, number>();
    this.getPageRankOperation.getPageRank().forEach((v, i) => {
      ret.set(this.currentState.indexHashMap[i], v);
    });
    return ret;
  }
}
