import bcrypt from 'bcryptjs';
import { Admin } from '../models/Admin.js';
import { generateToken } from '../utils/generateToken.js';
import { z } from 'zod';

const loginSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(8).max(100),
});

export async function login(req, res, next) {
  try {
    const { username, password } = loginSchema.parse(req.body);
    
    const envUsername = process.env.ADMIN_USERNAME;
    const envPasswordHash = process.env.ADMIN_PASSWORD_HASH;
    
    if (envUsername && envPasswordHash) {
      const isMatch = await bcrypt.compare(password, envPasswordHash);
      if (username === envUsername && isMatch) {
        const token = generateToken({ username: envUsername, source: 'env' });
        return res.json({ token });
      }
    }
    
    const admin = await Admin.findOne({ username });
    if (!admin) {
      await bcrypt.compare('dummy', '$2a$10$dummyhashfordummycomparison');
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = generateToken({ id: admin._id, username: admin.username });
    res.json({ token });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: err.errors });
    }
    next(err);
  }
}
