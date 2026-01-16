/* eslint-disable @typescript-eslint/no-explicit-any */

const callbacks: {
    [key: string]: any;
} = {};

interface VentResult {
    eventName: string;
    eventId: number;
}

const vent = {
    callbacks,

    on: function (
        eventName: string,
        callback: (data: any) => void,
    ): VentResult {
        if (!this.hasEvent(eventName)) {
            this.callbacks[eventName] = {};
        }
        const eventId = Math.random();
        this.callbacks[eventName][eventId] = callback;
        return {
            eventName,
            eventId,
        };
    },

    hasEvent: function (eventName: string): boolean {
        if (typeof this.callbacks[eventName] !== 'undefined') {
            for (const i in this.callbacks[eventName]) {
                i;
                return true;
            }
        }
        return false;
    },

    off: function (eventToRemove: VentResult): void {
        if (eventToRemove) {
            delete this.callbacks[eventToRemove.eventName][
                eventToRemove.eventId
            ];
        }
    },

    trigger: function (eventName: string, ...remainingArgs: any[]): void {
        if (this.hasEvent(eventName)) {
            for (const i in this.callbacks[eventName]) {
                this.callbacks[eventName][i].apply(null, remainingArgs);
            }
        }
    },
};

export default vent;
