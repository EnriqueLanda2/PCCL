import { MsgContext } from '../identity/user.dto';

export interface InscriptionCompletedEvent {
  inscriptionId: string;
  userId: string;
  courseId: string;
}

export interface InscriptionFindOnePayload extends MsgContext {
  id: string;
}

export interface InscriptionCreatePayload extends MsgContext {
  userId: string;
  courseId: string;
}

export interface InscriptionUpdatePayload extends MsgContext {
  id: string;
  status?: string;
}
