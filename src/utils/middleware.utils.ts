import { Request } from 'express';
import crypto from 'crypto';

// Generate a SHA-256 hash based on headers and IP for device fingerprinting
export const generateDeviceId = (req: Request): string => {
  const fingerprintParts = [
    req.headers['user-agent'], // Browser and OS
    req.headers['accept-language'], // Language preferences
    req.headers['sec-ch-ua'], // Browser brand
    req.headers['sec-ch-ua-platform'] || req.headers['x-operating-system'], // OS
    (getIpFromReq(req) || '').replace(/\.|:/g, ''), // Sanitized IP
    req.headers['x-client-hints'] // Optional extra hints
  ]
    .filter(Boolean)
    .join('|');

  return crypto.createHash('sha256').update(fingerprintParts).digest('hex');
};

// Get IP address from request
export const getIpFromReq = (req: Request): string => {
  const xForwardedFor = req.headers['x-forwarded-for'];
  if (typeof xForwardedFor === 'string') {
    return xForwardedFor.split(',')[0].trim();
  }
  return req.socket.remoteAddress || '';
};

// Get user agent string from request
export const getUserAgentFromReq = (req: Request): string => {
  return req.headers['user-agent'] || '';
};
