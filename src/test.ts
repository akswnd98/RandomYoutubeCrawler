import winstonLogger from './winstonLogger';

function main () {
  for (let i = 0; i < 10; i++) {
    run(i);
  }
}

function run (idx: number) {
  try {
    console.log('start');
    if (idx >= 3) throw Error('run failed');
    console.log('main');
  } catch (e) {
    winstonLogger.info('info message');
    winstonLogger.error('info message');
  }
}

main();
