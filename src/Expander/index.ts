export default abstract class Expander {
  abstract expandOneStep (): Promise<void>;
}
