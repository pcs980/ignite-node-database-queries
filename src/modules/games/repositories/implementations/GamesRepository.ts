import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;
  private userRepository: Repository<User>;

  constructor() {
    this.repository = getRepository(Game);
    this.userRepository = getRepository(User);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return this.repository
      .createQueryBuilder('games')
      .where(`games.title ILIKE '%${param}%'`)
      .getMany();
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query('select count(*) from games');
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    return this.userRepository
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.games', 'ugg')
      .where(`ugg.id = '${id}'`)
      .getMany();
      // Complete usando query builder
  }
}
