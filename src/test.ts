function main () {
  try {
    for (let i = 0; i < 10; i++) {
      run(i);
    }
  } catch (e) {
    console.log(e);
  }
}

function run (idx: number) {
  console.log('start');
  if (idx == 3) throw Error('run failed');
  console.log('main');
}

main();
