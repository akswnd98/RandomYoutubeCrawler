import Graph, { CurrentState } from '..';

export type ConstructorParam = {
  graphCurrent: Graph;
};

export default class Operation {
  protected currentState!: CurrentState;

  constructor (payload: ConstructorParam) {
    payload.graphCurrent.bindOperation(this);
  }

  bindGraphCurrent (currentState: CurrentState) {
    this.currentState = currentState;
  }
}
