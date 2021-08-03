import {
  Controller,
  Query,
  Get,
  MessageEvent,
  Post,
  Sse,
  Body,
  Param,
  Delete,
} from '@nestjs/common';
import {
  Observable,
  interval,
  of,
  zip,
  mergeMap,
  BehaviorSubject,
  flatMap,
  from,
  tap,
  filter,
  map,
} from 'rxjs';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';

type StreamToken = [string, Array<string>];
type RedisTuple = [string, Array<StreamToken>];

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post()
  create(@Body() createActivityDto: CreateActivityDto) {
    return this.activityService.create(createActivityDto);
  }

  @Get('/:sessionId')
  get(@Param('sessionId') sessionId: string, @Query('from') from: string) {
    return this.activityService.stream(sessionId, from);
  }

  // @Sse('/sse/:id/:sessionId')
  // stream(
  //   @Param('id') id: string,
  //   @Param('sessionId') sessionId: string,
  // ): Observable<MessageEvent> {
  //   const propagateId = (id: string) =>
  //     zip(from(this.activityService.stream(sessionId, id)), of(id));
  //
  //   const load$ = new BehaviorSubject('$');
  //
  //   return load$.pipe(
  //     mergeMap((id) => propagateId(id)),
  //
  //     tap(([data, prev_id]: [RedisTuple[], string]) => {
  //       const id = data ? data[0][1][data[0][1].length - 1][0] : prev_id;
  //
  //       load$.next(`${id}`);
  //     }),
  //
  //     filter(([data]: [RedisTuple[], string]) => data !== null),
  //
  //     mergeMap(([data]: [RedisTuple[], string]) => data),
  //     map((data) => {
  //       console.log('shailesh', data);
  //       // console.log('shailesh', data[0]);
  //       // console.log('shailesh 2', data);
  //
  //       return {
  //         data: {
  //           data,
  //         },
  //       };
  //     }),
  //   );
  //
  //   // return from(this.activityService.stream('54676244495769780', '$')).pipe(
  //   //   map((_) => {
  //   //     console.log(_);
  //   //     return { data: { hello: 'world' } };
  //   //   }),
  //   // );
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.activityService.findOne(id);
  // }
}
