import VisitMap from '..';

export type ConstructorParam = {
  visitMapCurrent: VisitMap;
};

export default class Operation {
  protected map!: Map<string, boolean>;

  constructor (payload: ConstructorParam) {
    payload.visitMapCurrent.bindOperation(this);
  }

  bindVisitMapCurrent (map: Map<string, boolean>) {
    this.map = map;
  }
}
