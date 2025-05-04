export class TestQueue {
    static queue: (() => void)[] = []

    static put(fn: () => void) {
        this.queue.push(fn)
    }

    static run() {
        setInterval(() => {
            const temp = this.queue.map(x => x)
            this.queue = []
            Promise.all(temp.map((x) => new Promise(x)))
        }, 1000)
    }
}
