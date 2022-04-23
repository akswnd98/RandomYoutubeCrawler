import Operation from '..';

export default class GetAll extends Operation {
  getAll () {
    return Array.from(this.map.keys());
  }
}
