import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Delete,
} from '@nestjs/common';
import { SessionService } from './session.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

@Controller('session')
export class SessionController {
  private events = [];
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  create(@Body() createSessionDto: CreateSessionDto) {
    return this.sessionService.create(createSessionDto);
  }

  @Post('screen/:id')
  record(@Body() e: Array<any>) {
    this.events = this.events.concat(e);
    return true;
  }

  @Get('/hello')
  replay() {
    // this.events = this.events.concat(e);
    return this.events;
  }

  @Get()
  findAll(@Query('url') url: string) {
    if (url) {
      return this.sessionService.findAllByUrl(url);
    }
    return this.sessionService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.sessionService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSessionDto: UpdateSessionDto) {
    return this.sessionService.update(id, updateSessionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sessionService.remove(id);
  }
}
