export default (obj, prop, setterHandler) => {
  let currValue = obj[prop];
  Object.defineProperty(obj, prop, {
    get() {
      // console.log(`get ${prop}`);
      return currValue;
    },
    set(val) {
      // console.log(`set ${prop}`);
      try {
        if (Object.prototype.toString.call(setterHandler) !== '[object Function]') {
          throw setterHandler + ' is not a function';
        }
        if (currValue === null || Object.prototype.toString.call(currValue) === Object.prototype.toString.call(val)) {
          if (val !== obj[prop]) {
            currValue = val;
            setterHandler.call(this, val);
          }
        } else {
          throw prop + ': Data type error!';
        }
      } catch (err) {
        console.error(err);
      }
    },
  });
};

// Object.defineProperty(app, 'score', {
//   get() {
//     return this.scoreValue;
//   },
//   set(val) {
//     if (Object.prototype.toString.call(val) !== '[object Number]') {
//       console.error(val + ' is not a number');
//     } else {
//       if (val % 2 === 0) {
//         console.log(val + ' 是偶數');
//       } else {
//         console.log(val + ' 是奇數');
//       }
//       this.scoreValue = val;
//     }
//   },
// });
