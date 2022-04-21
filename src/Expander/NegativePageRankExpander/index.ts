import Expander from '..';
import Graph from '../../Graph';

export type ConstructorParam = {
  beta?: number;
};

export default class NegativePageRankExpander extends Expander {
  beta: number = 0.8;

  constructor (payload: ConstructorParam) {
    super();
    this.beta = payload.beta !== undefined ? payload.beta : 0.8;
  }

  async expand (graph: Map<string, string[]>) {
    
  }

  convertToIndexBasedGraph (graph: Map<string, string[]>) {
    const ret = Array.from(graph.keys()).map(() => []);
    const hashToIndex = new Map<string, number>();
    Array.from(graph.keys()).forEach ((v, i) => {
      hashToIndex.set(v, i);
    });
    
  }

  getPageRank (graph: Map<string, string[]>) {
    const rank = new Map<string, number>();
    graph.forEach ((v, k) => {
      rank.set(k, 0);
    });
  }

  getNextStep (rank: Map<string, number>) {
    const ret = new Map<string, number>();
    rank.forEach ((v, k) => {
      ret.set(k, 0);
    });
    
  }


}
