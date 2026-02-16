export class ServiceError extends Error {
  constructor(
    public override message: string,
    public code?: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'ServiceError';
  }
}

export async function handleServiceError(
  error: unknown,
  fallbackMessage: string
): Promise<never> {
  console.error(`[Service Error]: ${fallbackMessage}`, error);

  if (error instanceof ServiceError) throw error;

  // Standardize Supabase and other errors
  let message = fallbackMessage;
  let code: string | undefined = undefined;

  if (error instanceof Error) {
    message = error.message || fallbackMessage;
    if ('code' in error) {
      code = (error as { code?: string }).code;
    }
  } else if (typeof error === 'object' && error !== null) {
    const err = error as Record<string, unknown>;
    message = typeof err.message === 'string' ? err.message : fallbackMessage;
    code = typeof err.code === 'string' ? err.code : undefined;
  }

  throw new ServiceError(message, code, error);
}
