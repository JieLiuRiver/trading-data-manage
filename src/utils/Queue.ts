class Queue<T> {
  private data: T[] = [];

  enqueue(item: T): void {
    this.data.push(item);
  }

  dequeue(): T | undefined {
    return this.data.shift();
  }

  peek(): T | undefined {
    return this.data[0];
  }

  isEmpty(): boolean {
    return this.data.length === 0;
  }

  size(): number {
    return this.data.length;
  }
}

export default Queue;
