import Operation, { ConstructorParam as ParentConstructorParam } from '..';

export type ConstructorParam = {
} & ParentConstructorParam;

export default class GetPageRank extends Operation {
  private beta: number = 0.8;
  private eps: number = 1e-3;

  constructor (payload: ConstructorParam) {
    super(payload);
  }

  getPageRank () {
    let prevRank = [];
    let rank = new Array(this.currentState.reverseMDPGraph.length).fill(undefined).map(() => 1 / Math.sqrt(this.currentState.reverseMDPGraph.length));
    let count = 0;
    do {
      prevRank = rank;
      rank = this.getNextStep(prevRank);
    } while (this.checkTolerance(prevRank, rank));
    return rank;
  }

  private getNextStep (rank: number[]) {
    const globalSum = this.getGlobalSum(rank);
    const rankSum = this.getRankSum(rank);
    const ret = new Array(this.currentState.reverseMDPGraph.length).fill(undefined).map(() => globalSum + (1 - this.beta) * rankSum);
    this.currentState.reverseMDPGraph.forEach((v, i) => {
      v.forEach((vv) => {
        ret[i] += this.beta * rank[vv] / this.currentState.mdpGraph[vv].length;
      });
    });
    const retNorm = this.getNorm(ret);
    return ret.map((v) => v / retNorm);
  }

  private getRankSum (rank: number[]) {
    let ret = 0;
    rank.forEach((v) => {
      ret += v;
    });
    return ret;
  }

  private getGlobalSum (rank: number[]) {
    let ret = 0;
    this.currentState.mdpGraph.forEach((v, i) => {
      if (v.length === 0) {
        ret += (1 / this.currentState.reverseMDPGraph.length) * rank[i];
      }
    });
    return ret;
  }

  private getDot (rank1: number[], rank2: number[]) {
    let ret = 0;
    rank1.forEach((v, i) => {
      ret += v * rank2[i];
    });
    return ret;
  }

  private getNorm (rank: number[]) {
    let square = 0;
    rank.forEach((v) => {
      square += v ** 2;
    });
    return Math.sqrt(square);
  }

  private checkTolerance (vec1: number[], vec2: number[]) {
    const dot = this.getDot(vec1, vec2);
    const sizeMul = this.getNorm(vec1) * this.getNorm(vec2);
    return dot < sizeMul + this.eps && dot > sizeMul - this.eps;
  }
}
