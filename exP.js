const PENDING = 'pengfing'
const RESOLVED = 'resolved'
const REJECTED = 'rejected'

function MyPromise (fn) {
	const _this = this;
  _this.value = undefined;
  _this.status = PENDING;
  _this.resolvedCallbacks = [];
  _this.rejectedCallbacks = [];
  
  function reject (val) {
  	if (_this.status === PENDING) {
    	_this.status = REJECTED;
      _this.value = val;
      _this.rejectedCallbacks.map(cb => cb());
    }
  }
  
  function resolve (val) {
    if (val instanceof MyPromise) {
    	val.then(resolve, reject);
    }
  	if (_this.status === PENDING) {
    	_this.status = RESOLVED;
      _this.value = val;
      _this.resolvedCallbacks.map(cb => cb());
    }
  }
  
  try {
  	fn(resolve, reject);
  } catch (e) {
  	reject(e)
  }
}

MyPromise.prototype.then = function (onFulfilled, onRejected) {
	onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v;
  onRejected = typeof onRejected === 'function' ? onRejected : e => {throw e};
  const _this = this;
  if (_this.status === PENDING) {
  	return (promise2 = new Promise((resolve, reject) => {
    	_this.resolvedCallbacks.push(() => {
      	try {
          const x = onFulfilled(_this.value);
          console.log('=======> x', x, typeof x)
          resolutionProcedure(promise2, x, resolve, reject);
        } catch(e) {
          reject(e)
        }
      });
      _this.rejectedCallbacks.push(() => {
      	try {
        	const x = onRejected(_this.value);
          resolutionProcedure(promise2, x, resolve, reject);
        } catch(e) {
          reject(e)
        }
      })
    }))
  }
  
  if (_this.status === RESOLVED) {
  	return (promise2 = new MyPromise((resolve, reject) => {
    	const x = onFulfilled(_this.value);
      resolutionProcedure(promise2, x, resolve, reject);
    }))
  }
  if (_this.status === REJECTED) {
  	return (promise2 = new MyPromise((resolve, reject) => {
    	const x = onRejected(_this.value);
      resolutionProcedure(promise2, x, resolve, reject);
    }))
  }
}

function resolutionProcedure(p2, x, resolve, reject) {
	if (p2 === x) {
  	new TypeError('Error');
  }
  
  if (x instanceof MyPromise) {
  	if (x.status === PENDING) {
    	x.then((value) => {
      	resolutionProcedure(p2, value, resolve, reject);
      }, reject)
    } else {
    	x.then(resolve, reject)
    }
  }
  let called = false;
  if (x !== null && (typeof x === 'function' || typeof x === 'object')) {
    // ...
    try {
      const { then } = x;
      if (typeof then === 'function') {
      	x.then(val => {
        	if (called)
            return;
          called = true;
          resolutionProcedure(p2, val, resolve, reject);
        }, err => {
        	if (called)
            return;
          called = true;
          reject(err);
        })
      } else {
      	resolve(x)
      }
    } catch (e) {
      if (called) return;
      called = true;
    	reject(e);
    }
  } else {
  	resolve(x);
  }
}

new MyPromise((resolve, reject) => {
  setTimeout(function () {
    resolve('pass it');
  }, 1000);
}).then((data) => new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('resolve it');
  }, 0);
})).then((res) => {
  console.log('====>res', res);
})

const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('i am p1')
  }, 3000)
})

const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('i am p2')
  }, 2000)
})

const p3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('i am p3')
  }, 1000)
})




function all (promiseList) {
  return new Promise((resolve, reject) => {
    if (!(promiseList instanceof Array)) {
      reject('arguments must be a array')
    }
    let resolveNum = 0;
    const resolveP = [];
    const pNum = promiseList.length;
    promiseList.forEach((i, index) => {
      Promise.resolve(i).then((data) => {
        resolveNum++;
        resolveP[index] = data;
        if (resolveNum === pNum) {
          resolve(resolveP);
        }
      }, err => reject(err))
    })
  })
}
// all([p1, p2, p3, 4])
//   .then((data) => {
//     data.forEach((i) => {
//       console.log(i);
//     })
//   })