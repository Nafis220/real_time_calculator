const asyncFunction = (reqFunction) => {
  return (req, res, next) => {
    Promise.resolve(reqFunction(req, res, next).catch((error) => next(error)));
  };
};
export { asyncFunction };
