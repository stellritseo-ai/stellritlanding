import { Request, Response, NextFunction } from 'express';

const ADMIN_TOKEN = process.env.ADMIN_SECRET_TOKEN ?? 'stellr-admin-dev-2024';

export function adminAuth(req: Request, res: Response, next: NextFunction): void {
  const token =
    (req.headers['x-admin-token'] as string) ||
    (req.query['token'] as string);

  if (!token || token !== ADMIN_TOKEN) {
    res.status(401).json({ error: 'Unauthorized — invalid admin token' });
    return;
  }
  next();
}
