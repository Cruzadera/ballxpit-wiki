import i18n from '../i18n';

const BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? 'http://localhost:3000/wiki';

export async function fetchWiki<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Accept-Language': i18n.language
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}: ${response.status}`);
  }

  return (await response.json()) as T;
}
