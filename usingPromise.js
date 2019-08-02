// const p1 = new Promise(function (resolve, reject) {
//   setTimeout(() => reject(new Error('fail')), 3000)
// })

// const p2 = new Promise(function (resolve, reject) {
//   setTimeout(() => resolve(p1), 1000)
// })

// p2
//   .then(result => console.log(result))
//   .catch(error => console.log(error))


new Promise((resolve, reject) => {
  setTimeout(() => {
    // try {
    //   console.log(a)
    // } catch (e) {
    //   reject(e)
    // }
  }, 0)
  reject(a)
}).then((val) => {
  console.log(val)
}).catch((err) => {
  console.log('====>catch', err)
})