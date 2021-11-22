export const fetcher = <Response,>(url: string) => fetch(url).then((res) => res.json())
