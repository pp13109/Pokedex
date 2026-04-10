const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2";
const DEFAULT_REVALIDATE_SECONDS = 60 * 60 * 24;

type PokeApiFetchOptions = RequestInit & {
  next?: {
    revalidate?: number;
  };
};

export class PokeApiHttpError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "PokeApiHttpError";
    this.status = status;
  }
}

export class PokeApiNotFoundError extends Error {
  constructor(message = "PokéAPI resource not found") {
    super(message);
    this.name = "PokeApiNotFoundError";
  }
}

export async function pokeApiFetch<T>(
  path: string,
  options?: PokeApiFetchOptions,
): Promise<T> {
  const response = await fetch(`${POKEAPI_BASE_URL}${path}`, {
    ...options,
    next: {
      revalidate: DEFAULT_REVALIDATE_SECONDS,
      ...options?.next,
    },
  });

  if (response.status === 404) {
    throw new PokeApiNotFoundError(`Resource not found: ${path}`);
  }

  if (!response.ok) {
    throw new PokeApiHttpError(
      `PokéAPI request failed with status ${response.status}`,
      response.status,
    );
  }

  return (await response.json()) as T;
}
