'use strict';


/**
 * Priority queue.
 */
module.exports = class PriorityQueue {
  /**
   * Creates a queue from a list.
   * @param {Array} list { priority, anything }
   */
  constructor(list) {
    this.list = list.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Dequeues an element with min priority and shifts it,
   * so next time another element with the same priority is dequeued
   * (that allows more even (fair) distribution of the elements).
   * @param {Function} skipFunction Is called for a candidate to dequeue.
   * Is used for possiblity to be able to skip a candidate and switch to th next one.
   */
  dequeue(skipFunction) {
    let index = 0;
    if (skipFunction) {
      while (this.list[index] && skipFunction(this.list[index])) {
        index += 1;
      }
    }
    const item = this.list[index];
    if (item) {
      item.priority = item.priority + 1;
      for (let i = index; i < this.list.length - 1; i += 1) {
        if (this.list[i + 1].priority > item.priority) {
          break;
        }
        const temp = this.list[i + 1];
        this.list[i + 1] = this.list[i];
        this.list[i] = temp;
      }
    }
    return item;
  };
}
