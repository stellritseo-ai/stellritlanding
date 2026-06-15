declare module 'express' {
  export type Request = any;
  export type Response = any;
  export type NextFunction = any;
  export function Router(): any;
}

declare module 'uuid' {
  export function v4(): string;
}

declare module 'express-rate-limit' {
  const rateLimit: any;
  export default rateLimit;
}

declare module 'socket.io' {
  export type Server = any;
  export type Socket = any;
}
