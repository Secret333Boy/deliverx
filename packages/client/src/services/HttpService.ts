import { HttpException } from '../exceptions';

export class HttpService {
  protected async request<T>(url: string, init?: RequestInit | undefined) {
    let res: Response;

    try {
      res = await fetch(url, init);
    } catch (e) {
      console.error(e);
      throw e;
    }

    const body = (
      res.headers.get('Content-Type')?.includes('application/json')
        ? await res.json()
        : await res.text()
    ) as T;

    if (!res.ok) throw new HttpException(res, body as { message?: string });

    return body;
  }

  protected async requestWithAuth<T>(
    url: string,
    init?: RequestInit | undefined,
    accessToken?: string,
  ) {
    return this.request<T>(url, {
      credentials: 'include',
      ...init,
      headers: { Authorization: `Bearer ${accessToken}`, ...init?.headers },
    });
  }

  public async get<T>(url: string, accessToken?: string) {
    return this.requestWithAuth<T>(url, undefined, accessToken);
  }

  public async post<T, B extends BodyInit | null | undefined>(
    url: string,
    body: B,
    accessToken?: string,
  ) {
    return this.requestWithAuth<T>(url, { method: 'POST', body }, accessToken);
  }

  public async patch<T, B extends BodyInit | null | undefined>(
    url: string,
    body: B,
    accessToken?: string,
  ) {
    return this.requestWithAuth<T>(url, { method: 'PATCH', body }, accessToken);
  }

  public async delete<T, B extends BodyInit | null | undefined>(
    url: string,
    body: B,
    accessToken?: string,
  ) {
    return this.requestWithAuth<T>(
      url,
      {
        method: 'DELETE',
        body,
      },
      accessToken,
    );
  }
}

const httpService = new HttpService();

export default httpService;
