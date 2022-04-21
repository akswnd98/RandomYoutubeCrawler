const a = [1, 2, 3];

const b = [2, 3];

b.push(...Array.from(a.keys()));

console.log(b);