import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || 'atlas-sanctum-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

export interface User {
  id: string;
  organization_id: string;
  email: string;
  full_name: string;
  role: 'super_admin' | 'analyst' | 'decision_maker' | 'field_verifier' | 'external_partner';
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  user: Omit<User, 'password_hash'>;
}

export class AuthService {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async register(userData: {
    email: string;
    password: string;
    full_name: string;
    role: User['role'];
    organization_id: string;
  }): Promise<AuthTokens> {
    const id = `usr_${uuidv4().substring(0, 12)}`;
    const password_hash = await bcrypt.hash(userData.password, 10);

    const result = await this.pool.query(
      `INSERT INTO users (id, organization_id, email, full_name, role, password_hash)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, organization_id, email, full_name, role, is_active, created_at, updated_at`,
      [id, userData.organization_id, userData.email, userData.full_name, userData.role, password_hash]
    );

    const user = result.rows[0];
    return this.generateTokens(user);
  }

  async login(email: string, password: string): Promise<AuthTokens> {
    const result = await this.pool.query(
      `SELECT * FROM users WHERE email = $1 AND is_active = true`,
      [email]
    );

    if (result.rows.length === 0) {
      throw new Error('Invalid credentials');
    }

    const user = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    return this.generateTokens(user);
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      const decoded = jwt.verify(refreshToken, JWT_SECRET) as { user_id: string };
      
      const result = await this.pool.query(
        `SELECT * FROM users WHERE id = $1 AND is_active = true`,
        [decoded.user_id]
      );

      if (result.rows.length === 0) {
        throw new Error('User not found');
      }

      const user = result.rows[0];
      return this.generateTokens(user);
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  async getUserById(userId: string): Promise<Omit<User, 'password_hash'> | null> {
    const result = await this.pool.query(
      `SELECT id, organization_id, email, full_name, role, is_active, created_at, updated_at
       FROM users WHERE id = $1`,
      [userId]
    );

    return result.rows[0] || null;
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (updates.full_name) {
      fields.push(`full_name = $${paramIndex++}`);
      values.push(updates.full_name);
    }
    if (updates.role) {
      fields.push(`role = $${paramIndex++}`);
      values.push(updates.role);
    }
    if (updates.is_active !== undefined) {
      fields.push(`is_active = $${paramIndex++}`);
      values.push(updates.is_active);
    }

    fields.push(`updated_at = NOW()`);
    values.push(userId);

    const result = await this.pool.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramIndex}
       RETURNING id, organization_id, email, full_name, role, is_active, created_at, updated_at`,
      values
    );

    return result.rows[0];
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    const result = await this.pool.query(
      `SELECT password_hash FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      throw new Error('User not found');
    }

    const isValidPassword = await bcrypt.compare(oldPassword, result.rows[0].password_hash);
    if (!isValidPassword) {
      throw new Error('Invalid old password');
    }

    const password_hash = await bcrypt.hash(newPassword, 10);
    await this.pool.query(
      `UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2`,
      [password_hash, userId]
    );
  }

  private generateTokens(user: User): AuthTokens {
    const payload = {
      user_id: user.id,
      email: user.email,
      role: user.role,
      organization_id: user.organization_id
    };

    const access_token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    const refresh_token = jwt.sign({ user_id: user.id }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });

    const { password_hash, ...userWithoutPassword } = user as any;

    return {
      access_token,
      refresh_token,
      user: userWithoutPassword
    };
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
