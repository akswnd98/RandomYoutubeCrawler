import Operation from '..';

export type PayloadParam = {
  id: string;
};


export default class CheckIsVisit extends Operation {
  checkIsVisit (payload: PayloadParam) {
    return this.map.get(payload.id) === true;
  }
}
