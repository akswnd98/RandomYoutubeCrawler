const map: Map<string, boolean> = new Map<string, boolean>();
map.set('gjosd', true);
map.set('jgbhsd', false);

console.log(JSON.stringify(Array.from(map.keys())));