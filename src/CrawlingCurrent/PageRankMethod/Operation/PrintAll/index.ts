import Operation from '..';
import { IndexHashMap } from '../../HashAdapter';

export type PayloadParam = {
  indexHashMap: IndexHashMap;
};

export default class PrintAll extends Operation {
  printAll (payload: PayloadParam) {
    this.currentState.mdpGraph.forEach((v, i) => {
      v.forEach((vv) => {
        console.log(`baseId: ${payload.indexHashMap[i]} -> relatedId: ${payload.indexHashMap[vv]}`);
      });
    });
  }
}
