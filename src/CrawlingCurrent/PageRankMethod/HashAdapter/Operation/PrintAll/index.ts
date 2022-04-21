import Operation, { ConstructorParam as ParentConstructorParam } from '..';
import PrintAllOperation from '../../../Operation/PrintAll';

export type ConstructorParam = {
} & ParentConstructorParam;

export type PayloadParam = {

};

export default class PrintAll extends Operation {
  private printAllOperation: PrintAllOperation;
  
  constructor (payload: ConstructorParam) {
    super(payload);
    this.printAllOperation = new PrintAllOperation({ crawlingCurrent: this.currentState.pageRankMethodCurrent });
  }

  printAll () {
    this.printAllOperation.printAll({ indexHashMap: this.currentState.indexHashMap });
  }
}
