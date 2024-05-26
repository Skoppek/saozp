function isNotDone(context, next) {
 const status = context.vars.statusId;
 const isStillProcessing = [1, 2].includes(status);
 return next(isStillProcessing);
}

function getSum(context, next) {
 const count = context.vars.count;
 context.vars['sum'] = (count * (count + 1)) / 2;
 return next();
}

module.exports = {
 isNotDone,
 getSum,
};
