import * as crypto from 'crypto';
import { Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import { Session } from './entities/session.entity';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

@Injectable()
export class SessionService {
  constructor(private readonly redisService: RedisService) {
    const defaultConfig = {
      orgId: '__default__',
      duration: 60,
    } as CreateSessionDto;

    const defaultRooms = [
      new Session({ ...defaultConfig, name: 'Help Needed' }),
      new Session({ ...defaultConfig, name: 'Meeting Room' }),
      new Session({ ...defaultConfig, name: 'Team Standup' }),
      new Session({ ...defaultConfig, name: 'Library Co-working' }),
    ];
    const client = redisService.getClient();
    client.set('SESSION:DEFAULT:Help', JSON.stringify({ ...defaultRooms[0] }));
    client.set(
      'SESSION:DEFAULT:Meeting',
      JSON.stringify({ ...defaultRooms[1] }),
    );
    client.set(
      'SESSION:DEFAULT:Standup',
      JSON.stringify({ ...defaultRooms[2] }),
    );
    client.set(
      'SESSION:DEFAULT:Library',
      JSON.stringify({ ...defaultRooms[3] }),
    );
  }

  async create(createSessionDto: CreateSessionDto): Promise<Session> {
    const client = this.redisService.getClient();
    if (createSessionDto.templateId) {
      console.log('session: ', createSessionDto);
      const existingSession = await this.findByUrl(
        createSessionDto.templateId,
        createSessionDto.panes[0].url,
      );
      if (existingSession) return existingSession;
    }
    //TODO:check if already a room has been created
    const session = new Session(createSessionDto);
    await client.set(session.id, JSON.stringify(session));
    await this.createIndicesByPanes(
      session.id,
      session.templateId,
      session.panes.map((pane) => pane.url),
    );
    return session;
  }

  async findAll(): Promise<Array<Session>> {
    const client = this.redisService.getClient();
    const keys = await client.keys('SESSION:*');
    const values = await client.mget(...keys);
    const sessions = values.map((value) => JSON.parse(value) as Session);
    return sessions;
  }

  async findById(id: string): Promise<Session> {
    const client = this.redisService.getClient();
    const value = await client.get(id);
    const session = JSON.parse(value) as Session;
    return session;
  }

  async findByUrl(templateId: string, url: string): Promise<Session> {
    const client = this.redisService.getClient();
    const paneId = crypto.createHash('sha256').update(url).digest('hex');
    const sessionIds = await client.get(`PANE:${paneId}`);
    let keys = JSON.parse(sessionIds);
    if (keys && keys.length > 0) {
      let roomId = keys
        .filter((key: string) => !!key)
        .find((k) => k.indexOf(templateId) >= 0);
      if (roomId) {
        roomId = roomId.replace(templateId + '|', '');
        const room = await client.get(roomId);
        return JSON.parse(room) as Session;
      }
    }
    return null;
  }

  async findAllByUrl(url: string): Promise<Array<Session>> {
    const client = this.redisService.getClient();
    const defaultSessions = await this.getDefaultSessions();
    const paneId = crypto.createHash('sha256').update(url).digest('hex');
    const sessionIds = await client.get(`PANE:${paneId}`);
    let keys = JSON.parse(sessionIds);
    if (keys && keys.length > 0) {
      keys = keys.filter((key: string) => !!key).map((k) => k.split('|')[1]);
      let values = await client.mget(...keys);
      values = values.filter((value) => !!value);
      const sessions = values.map((value) => JSON.parse(value) as Session);
      const sessionTemplateIds = sessions
        .map((session) => session.templateId)
        .filter((templateId) => !!templateId);
      const filteredDefaultSessions = defaultSessions.filter(
        (defaultSession) => sessionTemplateIds.indexOf(defaultSession._id) < 0,
      );
      console.log(sessionTemplateIds, filteredDefaultSessions);

      //TODO: Filter out default rooms where people already joined
      return [...filteredDefaultSessions, ...sessions];
    }
    return defaultSessions;
  }

  // async createFromDefaultSession(id: string, joinSessionDto: CreateSessionDto): Promise<Session> {
  //   const client = this.redisService.getClient();
  //   const defaultSession = await client.get(id);
  //   const { orgId, name, duration } = JSON.parse(defaultSession) as Session;
  //   const newSession = new Session(
  //     joinSessionDto
  //     // new CreateSessionDto({
  //     //   orgId,
  //     //   name,
  //     //   duration,
  //     //   panes: [url],
  //     //   templateId: id,
  //     // }),
  //   );
  //   await client.set(newSession.id, JSON.stringify(newSession));
  //   return newSession;
  // }

  async update(
    id: string,
    updateSessionDto: UpdateSessionDto,
  ): Promise<Session> {
    const client = this.redisService.getClient();
    const value = await client.get(id);
    const session = JSON.parse(value) as Session;
    const updatedSession = session.update(updateSessionDto);
    await client.set(updatedSession.id, JSON.stringify(updatedSession));
    return session;
  }

  async remove(id: string): Promise<boolean> {
    const client = this.redisService.getClient();
    await client.del(id);
    return true;
  }

  private async getDefaultSessions(): Promise<Array<Session>> {
    const client = this.redisService.getClient();
    const keys = await client.keys('SESSION:DEFAULT:*');
    const values = await client.mget(...keys);
    const defaultSessions = values.map((value) => JSON.parse(value) as Session);
    defaultSessions.forEach((session, index) => {
      session._id = keys[index];
    });
    return defaultSessions;
  }

  private async createIndicesByPanes(
    id: string,
    templateId: string,
    panes: Array<string>,
  ) {
    const client = this.redisService.getClient();
    const paneIds = panes.map(
      (pane) =>
        `PANE:${crypto.createHash('sha256').update(pane).digest('hex')}`,
    );
    try {
      const sessionIds = await client.mget(...paneIds);
      for (let i = 0; i < sessionIds.length; i++) {
        if (!sessionIds[i]) {
          await client.set(paneIds[i], JSON.stringify([`${templateId}|${id}`]));
        } else {
          const sessions = new Set(JSON.parse(sessionIds[i]));
          // const sessions = new Set([id]);
          sessions.add(`${templateId}|${id}`);
          await client.set(paneIds[i], JSON.stringify(Array.from(sessions)));
        }
      }
    } catch (error) {
      throw error;
    }
  }
}
