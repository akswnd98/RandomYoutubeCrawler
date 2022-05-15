import winstonLogger from '@/src/winstonLogger';

function helloWorld () {
  throw new Error('asdf');
}

function func () {
  try {
    helloWorld();
  } catch (e: any) {
    winstonLogger.error(e.stack);
  }
}

func();
