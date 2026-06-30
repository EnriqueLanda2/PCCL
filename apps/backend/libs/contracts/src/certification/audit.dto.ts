import { MsgContext } from '../identity/user.dto';

export interface AuditRegisterPayload extends MsgContext {
  method: string;
  endpoint: string;
  transactionType: string;
  actorScope: string;
  actorIdentifier: string | null;
  browser: string | null;
  description: string;
  statusCode: number | null;
}
