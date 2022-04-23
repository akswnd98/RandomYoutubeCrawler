import Operation from '..';

export default class PrintAll extends Operation {
  printAll () {
    console.log(this.map.size);
    this.map.forEach((v, k) => {
      console.log(`${k}: ${v}`);
    });
  }
}
