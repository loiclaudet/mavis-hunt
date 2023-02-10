export default function fetcher<K extends string | number | symbol, T>(
  url: string,
  body?: string | Record<K, T>,
  revalidate?: number
): Promise<unknown> {
  const headers = new Headers();
  headers.append("Accept", "application/json");
  // retrieved/generated from https://developers.skymavis.com/console
  headers.append("X-API-Key", process.env.SKYMAVIS_API_KEY as string);

  return fetch(url, {
    method: body ? "POST" : "GET",
    headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
    ...(revalidate ? { next: { revalidate } } : {}),
  })
    .then((res) => {
      if (res.status < 200 || res.status > 399) {
        console.log(res.status, "❌");
        throw new Error();
      }
      return res.json();
    })
    .catch((e) => console.error(e));
}
