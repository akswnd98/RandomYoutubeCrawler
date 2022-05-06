import Expander, { PayloadParam } from '..';
import winstonLogger from '@/src/winstonLogger';

export type ConstructorParam = {
  expander: Expander;
};

export default abstract class HandleExceptionDecorator extends Expander {
  private expander: Expander;

  constructor (payload: ConstructorParam) {
    super();
    this.expander = payload.expander;
  }

  async expand (payload: PayloadParam) {
    await this.expander.expand(payload);
  }

  abstract handleFail (): Promise<void>;
}
