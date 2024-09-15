const sleep = (milliseconds) => {
  return new Promise((res) => {
    setTimeout(res, milliseconds)
  })
}

export default sleep