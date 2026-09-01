import app from '../server/server.js';

/**
 * Vercel Serverless Function Handler
 * Proxies all incoming /api/* requests to the KRISHAK Express application.
 */
export default function handler(req, res) {
  return app(req, res);
}
