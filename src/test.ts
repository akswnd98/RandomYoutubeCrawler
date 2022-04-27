import Graph from './CrawlingCurrent/PageRankMethod/Graph/HashAdapter';
import GetPageRank from './CrawlingCurrent/PageRankMethod/Graph/HashAdapter/Operation/GetPageRank';
import InitGraph, { Edge } from './CrawlingCurrent/PageRankMethod/Graph/HashAdapter/Operation/Init';

const initNodes = [
  {
    id: 'a',
  }, {
    id: 'b',
  }, {
    id: 'c',
  }, {
    id: 'd',
  }, {
    id: 'e',
  }, {
    id: 'f',
  },
];

const initEdges: Edge[] = [
  {
    baseId: 'a',
    relatedId: 'b',
  }, {
    baseId: 'a',
    relatedId: 'c',
  }, {
    baseId: 'a',
    relatedId: 'f',
  }, {
    baseId: 'b',
    relatedId: 'c',
  }, {
    baseId: 'b',
    relatedId: 'd',
  }, {
    baseId: 'b',
    relatedId: 'f',
  }, {
    baseId: 'd',
    relatedId: 'e',
  }, {
    baseId: 'e',
    relatedId: 'b',
  }, {
    baseId: 'e',
    relatedId: 'f',
  },
];

const graph = new Graph();
const initGraph = new InitGraph({ graphCurrent: graph });
const getPageRank = new GetPageRank({ graphCurrent: graph });

initGraph.init({
  nodes: initNodes,
  edges: initEdges,
});

console.log(getPageRank.getPageRank());