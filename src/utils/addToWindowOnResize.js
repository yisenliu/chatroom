const addToWindowOnResize = (newFun, parameters = null) => {
  const existFn = window.onresize
  if (Object.prototype.toString.call(existFn) !== '[object Function]') {
    window.onresize = function () {
      newFun(parameters)
    }
  } else {
    window.onresize = () => {
      existFn()
      if (parameters) {
        newFun(parameters)
      } else {
        newFun()
      }
    }
  }
}

export default addToWindowOnResize
