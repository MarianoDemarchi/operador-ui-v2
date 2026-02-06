export class ApiError extends Error {
  status: number;
  code?: string;
  endpoint?: string;
  method?: string;
  user?: string;
  action?: string;
  details?: any;

  constructor({
    message,
    status,
    code,
    endpoint,
    method,
    user,
    action,
    details,
  }: {
    message: string;
    status: number;
    code?: string;
    endpoint?: string;
    method?: string;
    user?: string;
    action?: string;
    details?: any;
  }) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.endpoint = endpoint;
    this.method = method;
    this.user = user;
    this.action = action;
    this.details = details;
  }
}
