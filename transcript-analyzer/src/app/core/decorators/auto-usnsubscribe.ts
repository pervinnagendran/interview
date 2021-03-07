export default function AutoUnsubscribe(): (constructor: new (...args: any[]) => void) => void {
    return (constructor: new (...args: any[]) => void): void => {
        const onDestroy = constructor.prototype.ngOnDestroy;
        constructor.prototype.ngOnDestroy = function(): void {
            for (const prop in this) {
                if (typeof this[prop].subscribe === 'function') {
                    this[prop].unsubscribe();
                }
            }
            onDestroy.apply();
        };
    };
}
