function isNotDone(context, next) {
  const status = context.vars.statusId;
  const continuePooling = [1, 2].includes(status);
  return next(continuePooling);
}

module.exports = {
  isNotDone: isNotDone,
};
