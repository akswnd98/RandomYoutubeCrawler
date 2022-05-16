import Operation from '..';

export type Node = {
  id: string;
};

export default class Set extends Operation {
  set (node: Node) {
    this.map.set(node.id, true);
  }
}
