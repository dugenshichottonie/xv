import type { Context } from "@netlify/edge-functions";

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);

  if (url.pathname === '/') {
    url.pathname = '/ja';
    return Response.redirect(url);
  }

  return;
};
