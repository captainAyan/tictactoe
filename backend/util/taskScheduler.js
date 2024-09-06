let timeoutId;

function startScheduler(task, validation, delay) {
  console.log("setting timer");

  if (!timeoutId) {
    timeoutId = setTimeout(() => {
      task();

      timeoutId = null;

      if (validation()) startScheduler(task, validation, delay);
    }, delay);
  }
}

function stopScheduler() {
  clearTimeout(timeoutId);
  timeoutId = null;
}

module.exports = {
  startScheduler,
  stopScheduler,
};

/*
/// testing
let count = 5;
function _task() {
  console.log("executing task", "count", count);
  count -= 1;
}
function _validation() {
  console.log("validating");
  return count > 0;
}

startScheduler(_task, _validation, 3000);
 */
