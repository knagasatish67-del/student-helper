// Real-time helper utilities for notifications and chat sync
type Listener = (data: any) => void;

class SimpleEventEmitter {
  private events: Map<string, Listener[]> = new Map();

  on(event: string, listener: Listener) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)!.push(listener);
    return () => this.off(event, listener);
  }

  off(event: string, listener: Listener) {
    const listeners = this.events.get(event);
    if (!listeners) return;
    this.events.set(
      event,
      listeners.filter((l) => l !== listener)
    );
  }

  emit(event: string, data: any) {
    const listeners = this.events.get(event);
    if (listeners) {
      listeners.forEach((l) => {
        try {
          l(data);
        } catch (e) {
          console.error('Event listener error', e);
        }
      });
    }
  }
}

export const socketEmitter = new SimpleEventEmitter();
