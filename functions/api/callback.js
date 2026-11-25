function page(status, content) {
  return '<!doctype html><html><body><script>' +
    '(function(){var msg=' + JSON.stringify('authorization:github:' + status + ':' + JSON.stringify(content)).replace(/</g, '\\u003c') + ';' +
    'function recv(e){window.opener.postMessage(msg,e.origin);window.removeEventListener("message",recv,false);}' +
    'window.addEventListener("message",recv,false);window.opener.postMessage("authorizing:github","*");})();' +
    '</script></body></html>';
}
export async function onRequest(context) {
  const { request, env } = context;
  const headers = { 'content-type': 'text/html;charset=UTF-8' };
  try {
    const code = new URL(request.url).searchParams.get('code');
    const r = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'accept': 'application/json', 'user-agent': 'kosharyhind-site' },
      body: JSON.stringify({ client_id: env.GITHUB_CLIENT_ID, client_secret: env.GITHUB_CLIENT_SECRET, code }),
    });
    const result = await r.json();
    if (result.error) return new Response(page('error', result), { headers, status: 401 });
    return new Response(page('success', { token: result.access_token, provider: 'github' }), { headers, status: 200 });
  } catch (e) {
    return new Response(e.message, { status: 500 });
  }
}
