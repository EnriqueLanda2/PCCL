import type { NextFunction, Request, Response } from 'express';

export function createProxyHandler(targetBaseUrl: string) {
  return async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const targetUrl = new URL(req.originalUrl, targetBaseUrl);
      const method = req.method.toUpperCase();
      const headers = new Headers();

      for (const [key, value] of Object.entries(req.headers)) {
        if (
          value === undefined ||
          key === 'host' ||
          key === 'connection' ||
          key === 'content-length'
        ) {
          continue;
        }

        if (Array.isArray(value)) {
          headers.set(key, value.join(', '));
          continue;
        }

        headers.set(key, value);
      }

      const response = await fetch(targetUrl, {
        method,
        headers,
        body: method === 'GET' || method === 'HEAD' ? undefined : serializeBody(req.body),
      });

      res.status(response.status);

      const contentType = response.headers.get('content-type');
      if (contentType) {
        res.setHeader('content-type', contentType);
      }

      const setCookie = response.headers.get('set-cookie');
      if (setCookie) {
        res.setHeader('set-cookie', setCookie);
      }

      if (response.status === 204) {
        res.end();
        return;
      }

      const payload = await response.text();
      if (contentType?.includes('application/json')) {
        res.send(payload ? JSON.parse(payload) : null);
        return;
      }

      res.send(payload);
    } catch (error) {
      res.status(502).json({
        message: 'Gateway no pudo comunicarse con el servicio',
        detail: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
}

function serializeBody(body: unknown) {
  if (body == null) {
    return undefined;
  }

  if (typeof body === 'string') {
    return body;
  }

  return JSON.stringify(body);
}