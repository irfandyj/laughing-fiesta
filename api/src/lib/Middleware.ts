export class Middleware {

  middlewares: Function[];
  constructor() {
    this.middlewares = [];
  }

  use(fn: Function) {
    this.middlewares.push(fn);
    return this
  }

  executeMiddleware(data: any, done: Function) {
    this.middlewares.reduceRight((done, next) => () => next(data, done), done)(data);
  }

  run(data: any) {
    this.executeMiddleware(data, done => console.log(data));
  }

}

