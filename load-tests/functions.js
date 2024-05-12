function isNotDone(context, next) {
 const status = context.vars.statusId;
 const isStillProcessing = [1, 2].includes(status);
 return next(isStillProcessing);
}

function logStatus(context, events) {
 const status = context.vars.statusId;
 if (status > 2) {
  events.emit('status', status);
 }
}

module.exports = {
 isNotDone: isNotDone,
 logStatus: logStatus,
};
