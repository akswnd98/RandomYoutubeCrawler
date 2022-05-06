function a () {
  for(let i = 0; i < 5; i++) {
    console.log(i);
    if (i == 2) {
      throw Error('hello');
    }
  }
}

function b () {
  try {
    a();
  } catch (e) {
    console.log(e);
  }
}

b();

console.log('asdf');