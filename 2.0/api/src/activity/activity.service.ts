import { Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import { CreateActivityDto } from './dto/create-activity.dto';

type StreamToken = [string, Array<string>];
type RedisTuple = [string, Array<StreamToken>];

@Injectable()
export class ActivityService {
  constructor(private readonly redisService: RedisService) {}
  async create(createActivityDto: CreateActivityDto) {
    const client = this.redisService.getClient();
    if (createActivityDto.isCheckout) {
      const res = await client.xtrim(
        `activity:${createActivityDto.sessionId}`,
        'MINID',
        new Date().getTime() - 1000,
      );
      console.log('deleted ', res);
    }
    await client.xadd(
      `activity:${createActivityDto.sessionId}`,
      '*',
      'screen',
      JSON.stringify(createActivityDto.event),
    );

    // if (createActivityDto.isCheckout) {
    //   client.set(
    //     `ACTIVITY:${createActivityDto.sessionId}:checkpoint`,
    //     checkpoint,
    //   );
    // }
    return 'This action adds a new activity';
  }

  findOne(id: string) {
    return `This action returns a #${id} activity`;
  }

  async stream(sessionId: string, id: string) {
    const client = this.redisService.getClient();
    if (id === '$') {
      // const value = await client.get(`ACTIVITY:${sessionId}:checkpoint`);
      // if (!value) {
      id = '0';
      // } else {
      // id = value;
      // }
    }
    const data = await client.xread(
      'BLOCK',
      '1000',
      'STREAMS',
      `activity:${sessionId}`,
      id,
    );

    // console.log(data[0][1]);
    if (data && data.length > 0) {
      const id = data[0][1][data[0][1].length - 1][0];
      const events = data[0][1].map((e) => e[1][1]);
      return {
        id,
        events: events.map((e) => JSON.parse(e)),
      };
    }
    return null;
  }
}
