export class ExternalPromise {
  constructor() {
    this._isSettled = false;
    this.resolve = () => {};
    this.reject = () => {};
    this._promise = new Promise((resolve, reject) => {
      this.resolve = (value) => {
        if (this._isSettled) return;
        resolve(value);
        this._isSettled = true;
      };
      this.reject = (value) => {
        if (this._isSettled) return;
        reject(value);
        this._isSettled = true;
      };
    });
  }

  isSettled() {
    return this._isSettled;
  }

  promise() {
    return this._promise;
  }
}
