import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from '../db/db.module';

export interface CharacterRow {
  id: number;
  account_id: number;
  display_name: string;
  allegiance: string;
  created_at: Date;
}

@Injectable()
export class CharactersService {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async findByAccount(accountId: number): Promise<CharacterRow | null> {
    const res = await this.pool.query<CharacterRow>(
      `SELECT id, account_id, display_name, allegiance, created_at
       FROM characters WHERE account_id = $1 LIMIT 1`,
      [accountId],
    );
    return res.rows[0] ?? null;
  }

  async create(accountId: number, displayName: string, allegiance: string): Promise<CharacterRow> {
    const name = displayName.trim();
    try {
      const res = await this.pool.query<CharacterRow>(
        `INSERT INTO characters (account_id, display_name, allegiance)
         VALUES ($1, $2, $3)
         RETURNING id, account_id, display_name, allegiance, created_at`,
        [accountId, name, allegiance],
      );
      return res.rows[0]!;
    } catch (err) {
      if ((err as { code?: string }).code === '23505')
        throw new ConflictException('Display name is already taken');
      throw err;
    }
  }
}
