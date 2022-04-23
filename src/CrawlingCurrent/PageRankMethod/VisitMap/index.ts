import Operation from './Operation';


export default class VisitMap {
  private map: Map<string, boolean>;

  constructor () {
    this.map = new Map<string, boolean>();
  }

  bindOperation (operation: Operation) {
    operation.bindVisitMapCurrent(this.map);
  }
}
