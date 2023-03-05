export default async function fetcher<K extends string | number | symbol, T>(
  url: string,
  body?: string | Record<K, T>,
  revalidate?: number
): Promise<unknown> {
  const headers = new Headers();
  headers.append("Accept", "application/json");
  // retrieved/generated from https://developers.skymavis.com/console
  headers.append("X-API-Key", process.env.SKYMAVIS_API_KEY as string);

  try {
    const response = await fetch(url, {
      method: body ? "POST" : "GET",
      headers,
      ...(body ? { body: JSON.stringify(body) } : {}),
      next: {
        revalidate: revalidate ?? 60,
      },
    });
    const data = (await response.json()) as T | undefined;
    if (response.ok) {
      return data;
    }
    // 429 response is a rate limit error
    if (response.status === 429) {
      // returns a fulfilled promise with the error message, with a undefined value
      const retryAfter = response.headers.get("Retry-After");
      throw new Error(
        `❌ Rate limit exceeded. Try again ${
          retryAfter ? `in ${retryAfter} seconds` : "later"
        }.`
      );
    }
    throw new Error(`❌ ${response.status}, ${response.statusText}`);

    // return data;
  } catch (e) {
    console.error(e);
  }
}
