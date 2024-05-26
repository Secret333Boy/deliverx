export interface ResponseBody {
  message?: string | string[];
}

export interface HttpExceptionBody {
  message?: string;
}

export class HttpException {
  public readonly body?: HttpExceptionBody;

  constructor(
    public readonly response: Response,
    body?: HttpExceptionBody,
  ) {
    if (Array.isArray(body?.message)) {
      this.body = { message: body?.message?.join(', ') };
    } else {
      this.body = body;
    }
  }
}
