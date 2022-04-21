export default abstract class Expander {
  abstract expand (graph: Map<string, string[]>): Promise<void>;
}
