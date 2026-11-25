export async function onRequest(context) {
  const { request, env } = context;
  try {
    const url = new URL(request.url);
    const u = new URL('https://github.com/login/oauth/authorize');
    u.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
    u.searchParams.set('redirect_uri', url.origin + '/api/callback');
    u.searchParams.set('scope', 'public_repo');
    u.searchParams.set('state', crypto.getRandomValues(new Uint8Array(12)).join(''));
    return Response.redirect(u.href, 302);
  } catch (e) {
    return new Response(e.message, { status: 500 });
  }
}
