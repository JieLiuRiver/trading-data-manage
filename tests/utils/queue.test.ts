import Queue from '../../src/utils/Queue';

describe('Queue', () => {
  let queue: Queue<number>;

  beforeEach(() => {
    queue = new Queue<number>();
  });

  test('enqueue adds item to the queue', () => {
    queue.enqueue(1);
    expect(queue.size()).toBe(1);
    expect(queue.peek()).toBe(1);
  });

  test('dequeue removes and returns item from the front of the queue', () => {
    queue.enqueue(1);
    queue.enqueue(2);
    expect(queue.dequeue()).toBe(1);
    expect(queue.size()).toBe(1);
    expect(queue.peek()).toBe(2);
  });

  test('peek returns the item at the front of the queue without removing it', () => {
    queue.enqueue(1);
    queue.enqueue(2);
    expect(queue.peek()).toBe(1);
    expect(queue.size()).toBe(2);
  });

  test('isEmpty returns true for empty queue', () => {
    expect(queue.isEmpty()).toBe(true);
  });

  test('isEmpty returns false for non-empty queue', () => {
    queue.enqueue(1);
    expect(queue.isEmpty()).toBe(false);
  });
  test('size returns the number of items in the queue', () => {
    expect(queue.size()).toBe(0);
    queue.enqueue(1);
    queue.enqueue(2);
    expect(queue.size()).toBe(2);
  });
});
