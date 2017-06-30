'use strict';

/**
 *
 * @param {Array} list { priority, anything }
 */
function RotatingPriorityList(list) {
  this.list = list.sort((a, b) => b.priority - a.priority);
  this.index = -1;
  this.popped = [];
}

RotatingPriorityList.prototype.reset = function () {
  this.index = -1;

  this.popped.forEach(item => {
    for (let i = this.list.indexOf(item); i < this.list.length - 1; i += 1) {
      if (this.list[i + 1].priority !== item.priority) {
        break;
      }
      const temp = this.list[i + 1];
      this.list[i + 1] = this.list[i];
      this.list[i] = temp;
    }
  });

  this.popped = [];
};

RotatingPriorityList.prototype.peekNext = function () {
  this.index += 1;
  return this.list[this.index];
};

RotatingPriorityList.prototype.popCurrent = function () {
  if (this.index >= this.list.length) {
    return;
  }

  // decrement priority of current item
  const item = this.list[this.index];
  item.priority = Math.max(item.priority - 1, 0);

  this.popped.push(item);
};

module.exports = RotatingPriorityList;