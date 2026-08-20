import { Logger } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';

const sendMock = jest.fn().mockResolvedValue({ id: 'mail_1' });

jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({ emails: { send: sendMock } })),
}));

function buildConfig(values: Record<string, unknown>): ConfigService {
  return {
    get: jest.fn((key: string, def?: unknown) => values[key] ?? def),
  } as unknown as ConfigService;
}

describe('MailService', () => {
  afterEach(() => jest.clearAllMocks());

  it('loggea el código en vez de mandarlo si no hay RESEND_API_KEY', async () => {
    const logSpy = jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
    const service = new MailService(buildConfig({}));

    await service.sendPasswordResetCode('ana@example.com', '123456');

    expect(sendMock).not.toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('123456'));
    logSpy.mockRestore();
  });

  it('manda el correo por Resend cuando hay RESEND_API_KEY', async () => {
    const service = new MailService(
      buildConfig({ RESEND_API_KEY: 'test_key', MAIL_FROM: 'no-reply@koodisoft.com' }),
    );

    await service.sendPasswordResetCode('ana@example.com', '123456');

    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'ana@example.com',
        from: 'no-reply@koodisoft.com',
        subject: expect.any(String),
        html: expect.stringContaining('123456'),
      }),
    );
  });
});
