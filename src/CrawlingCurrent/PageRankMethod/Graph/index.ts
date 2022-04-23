import Operation from './Operation';

export type CurrentState = {
  reverseMDPGraph: IndexBaseMDPGraph;
  mdpGraph: IndexBaseMDPGraph;
};

export type IndexBaseMDPGraph = number[][];

export default class Graph {
  private currentState: CurrentState;

  constructor () {
    this.currentState = {
      reverseMDPGraph: [],
      mdpGraph: [],
    };
  }

  bindOperation (operation: Operation) {
    operation.bindGraphCurrent(this.currentState);
  }
}
