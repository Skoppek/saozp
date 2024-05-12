function isNotDone(context, next) {
 const status = context.vars.statusId;
 const isStillProcessing = [1, 2].includes(status);
 return next(isStillProcessing);
}

module.exports = {
 isNotDone: isNotDone,
};
