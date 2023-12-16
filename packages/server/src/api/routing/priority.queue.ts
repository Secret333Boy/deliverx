export class PriorityQueue<T> {
  constructor(
    private buffer: { item: T; priority: number }[] = [],
    private inversed?: boolean,
  ) {
    this.buffer.sort(
      (a, b) => (a.priority - b.priority) * (this.inversed ? -1 : 1),
    );
  }

  public enqueue(item: T, priority = 0) {
    this.buffer.push({ item, priority });
    this.buffer.sort(
      (a, b) => (a.priority - b.priority) * (this.inversed ? -1 : 1),
    );
  }

  public dequeue(): T {
    return this.buffer.pop()?.item;
  }
}
