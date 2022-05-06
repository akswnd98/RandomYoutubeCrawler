import Expander, { PayloadParam } from '..';
import HandleExceptionDecorator from '../HandleExceptionDecorator';

export type ConstructorParam = {
  expanders: HandleExceptionDecorator[];
};

export default class ContainerExpander extends Expander {
  expanders: HandleExceptionDecorator[];

  constructor (payload: ConstructorParam) {
    super();
    this.expanders = payload.expanders;
  }

  async expand (payload: PayloadParam) {
    let i = 0;
    try {
      for (; i < this.expanders.length; i++) {
        await this.expanders[i].expand(payload);
      }
    } catch (e) {
      for (let j = i; j >= 0; j--) {
        await this.expanders[j].handleFail();
      }
    }
  }
}
