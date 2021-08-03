import { CreateSessionDto } from '../dto/create-session.dto';
import { UpdateSessionDto } from '../dto/update-session.dto';
import * as uniqid from 'uniqid';

/*
 * 10 people can discuss on the 5 pages from same SAAS web app in 3 different rooms
 *
 *
 * Get all rooms available on a url + default
 * John joins the 'Standup room'
 * Room ID is static -> How do you segregate between different web apps?
 * Socket connection is Room ID + URL Hash
 */
export interface IPane {
  title: string;
  url: string;
}

//TODO: No private sessions aka private rooms are available right now
export class Session {
  private readonly prefix = 'SESSION';
  userId: string | undefined;
  createTimestamp: Date;
  name: string;
  updateTimestamp: Date;
  duration: number;
  panes: Array<IPane>;
  status: string;
  endTimestamp: Date;
  orgId: string;
  templateId: string | undefined;
  _id: string;

  get id(): string {
    return this._id;
  }

  constructor(createSessionDto: CreateSessionDto) {
    const {
      name,
      orgId,
      templateId,
      duration,
      userId,
      panes,
    } = createSessionDto;
    const now = new Date();

    this.createTimestamp = now;
    this.updateTimestamp = now;
    this._id = uniqid(`${this.prefix}:`);
    this.orgId = orgId;
    this.templateId = templateId;
    this.name = name;
    this.userId = userId;
    this.duration = duration;
    this.panes = panes;
    this.status = 'STARTED';
  }

  update(updateSessionDto: UpdateSessionDto) {
    const { endTimestamp, status, panes } = updateSessionDto;
    this.updateTimestamp = new Date();
    this.endTimestamp = endTimestamp;
    this.status = status;
    if (panes) {
      this.panes = panes;
    }
    return this;
  }
}
