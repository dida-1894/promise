const PENDING = 'pengfing'
const RESOLVED = 'resolved'
const REJECTED = 'rejected'

function resolutionProcedure(p2, x, resolve, reject) {
	if (p2 === x) {
  	new TypeError('Error');
  }
  if (x instanceof MyPromise) {
    if (x.status === PENDING) {
      x.then((val) => {
        resolutionProcedure(p2, val, resolve, reject)
      })
    } else {
      x.then(resolve, reject);
    }
  }
  let called;
  if (x !==null && (typeof x === 'object' || typeof x === 'function')) {
    const { then } = x;
    if (typeof then === 'function') {
      if (called)
        return;
      called = true;
      x.then(val => {
        resolutionProcedure(p2, val, resolve, reject);
      }, err => {
        if (called)
        return;
        called = true;
        reject(err);
      })
    } else {
      resolve(x);
    }
  } else {
    resolve(x)
  }
}

function MyPromise (fn) {
	const _this = this;
  _this.value = undefined;
  _this.status = PENDING;
  _this.resolvedCallbacks = [];
  _this.rejectedCallbacks = [];
  _this.resolve = resolve;
  _this.reject = reject;
  
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
  onRejected = typeof onRejected === 'function' ? onRejected : r => { throw r };
  const _this = this;
  
  if (_this.status === PENDING) {
    return (p2 = new Promise((resolve, reject) => {
    	_this.resolvedCallbacks.push(() => {
      	try {
          const x = onFulfilled(_this.value);
          resolutionProcedure(p2, x, resolve, reject);
        } catch (e) {
          reject(e);
        }
      });
      _this.rejectedCallbacks.push(() => {
      	try {
        	const x = onRejected(_this.value);
          resolutionProcedure(p2, x, resolve, reject);
        } catch (e) {
          reject(e);
        }
      })
    }))
  }
  if (_this.status === RESOLVED) {
    return (p2 = new MyPromise((resolve, reject) => {
      try {
        setTimeout(() => {
          const x = onFulfilled(_this.value);
          resolutionProcedure(p2, x, resolve, reject);
        })
      } catch(e) {
        reject(e);
      }
    }))
  }

  if (_this.status === REJECTED) {
    return (p2 = new MyPromise((resolve, reject) => {
      try {
        setTimeout(() => {
          const x = onRejected(_this.value);
          resolutionProcedure(p2, x, resolve, reject);
        })
      } catch(e) {
        reject(e)
      }
    }))
  }
  
}


MyPromise.prototype.catch = function (onRejected) {
  // const { then } = MyPromise.prototype
  return this.then(null, onRejected);
}

MyPromise.prototype.finally = function (final) { // 不论是reolve还是reject都会执行finally
  return this.then(() => final(), () => final());
}

MyPromise.prototype.resolve = function (val) {
  this.resolve(val);
}


MyPromise.prototype.all = function (arr) {
  if (arr instanceof Array) { // 其实这个是只要有遍历器属性的对象即可， 下次完善一下。
    new TypeError('err')
  }
  const resolvedNum = 0;
  const promiseNum = arr.length;
  const resolvedP = [];
  arr.forEach((i) => {
    MyPromise.resolve()
  });
}

new MyPromise((resolve, reject) => {
  reject(98999)
}).catch((err) => {
  console.log('====> err', err);
}).finally(() => {
  console.log('i am finally');
})
