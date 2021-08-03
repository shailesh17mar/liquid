import { IPane } from '../entities/session.entity';

export class CreateSessionDto {
  orgId: string;
  name: string;
  userId: string | undefined;
  templateId: string | undefined;
  panes: Array<IPane>;
  duration: number;

  constructor({ orgId, name, panes, templateId, duration }) {
    this.orgId = orgId;
    this.name = name;
    this.panes = panes;
    this.duration = duration;
    this.templateId = templateId;
  }
}
