import { BackendRoute } from '../config';
import { HttpService } from './HttpService';

export class ApiService extends HttpService {
  constructor(public readonly backendUrl = process.env.REACT_APP_BACKEND_URL) {
    super();
  }

  public getJoinedPath(endpoint: BackendRoute) {
    return `${this.backendUrl}/api/v1${endpoint}`;
  }

  public async requestWithAuth<T>(
    endpoint: BackendRoute,
    init?: RequestInit | undefined,
    accessToken?: string,
  ): Promise<T> {
    if (!accessToken) accessToken = localStorage.getItem('accessToken') || '';

    const url = this.getJoinedPath(endpoint);

    let res: T;

    try {
      res = await super.requestWithAuth<T>(
        url,
        {
          headers: { 'Content-Type': 'application/json', ...init?.headers },
          ...init,
        },
        accessToken,
      );
      return res;
    } catch (e) {
      try {
        await this.refreshTokens();
      } catch (_ingore) {
        throw e;
      }
      accessToken = localStorage.getItem('accessToken') || '';
      res = await super.requestWithAuth<T>(url, init, accessToken);
      return res;
    }
  }

  public async refreshTokens() {
    const { accessToken } = await super.requestWithAuth<{
      accessToken: string;
    }>(this.getJoinedPath(BackendRoute.AUTH_REFRESH));

    localStorage.setItem('accessToken', accessToken);
  }

  public async get<T>(endpoint: BackendRoute) {
    return this.requestWithAuth<T>(endpoint);
  }

  public async post<T, B = unknown>(endpoint: BackendRoute, body?: B) {
    return this.requestWithAuth<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  public async patch<T, B>(endpoint: BackendRoute, body?: B) {
    return this.requestWithAuth<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  public async delete<T, B>(endpoint: BackendRoute, body?: B) {
    return this.requestWithAuth<T>(endpoint, {
      method: 'DELETE',
      body: JSON.stringify(body),
    });
  }
}

const apiService = new ApiService();

export default apiService;
