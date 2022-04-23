import Operation from '..';

export type PayloadParam = {
  nodes: Node[];
};

export type Node = {
  id: string;
  visit: boolean;
};

export default class Init extends Operation {
  init (payload: PayloadParam) {
    payload.nodes.forEach((v) => {
      this.map.set(v.id, v.visit);
    });
  }
}
