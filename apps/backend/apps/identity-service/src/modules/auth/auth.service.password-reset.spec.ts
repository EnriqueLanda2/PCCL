import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';

const USER = { id: 'user-1', email: 'ana@example.com', active: true } as any;

function buildService(opts: {
  user?: any;
  existingCode?: any;
  updateResult?: any;
} = {}) {
  const prisma = {
    passwordResetCode: {
      findFirst: jest.fn().mockResolvedValue(opts.existingCode ?? null),
      updateMany: jest.fn().mockResolvedValue({ count: 0 }),
      create: jest.fn().mockResolvedValue({ id: 'code-1' }),
      update: jest.fn().mockResolvedValue(opts.updateResult ?? {}),
    },
    user: { update: jest.fn().mockResolvedValue({}) },
    $transaction: jest.fn((ops: Promise<unknown>[]) => Promise.all(ops)),
  };
  const usersService = {
    findByEmail: jest.fn().mockResolvedValue(opts.user === undefined ? USER : opts.user),
  };
  const mailService = { sendPasswordResetCode: jest.fn().mockResolvedValue(undefined) };

  const service = new AuthService(
    usersService as any,
    {} as any,
    { get: jest.fn() } as any,
    {} as any,
    prisma as any,
    mailService as any,
  );

  return { service, prisma, usersService, mailService };
}

describe('AuthService · forgotPassword', () => {
  it('genera un código y manda el correo si el usuario existe', async () => {
    const { service, prisma, mailService } = buildService();

    const result = await service.forgotPassword('ana@example.com');

    expect(prisma.passwordResetCode.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ userId: 'user-1' }) }),
    );
    expect(mailService.sendPasswordResetCode).toHaveBeenCalledWith('ana@example.com', expect.any(String));
    expect(result).toEqual({ message: 'Si el correo existe, te llegó un código.' });
  });

  it('no crea código ni manda correo si el usuario no existe, pero responde igual', async () => {
    const { service, prisma, mailService } = buildService({ user: null });

    const result = await service.forgotPassword('nadie@example.com');

    expect(prisma.passwordResetCode.create).not.toHaveBeenCalled();
    expect(mailService.sendPasswordResetCode).not.toHaveBeenCalled();
    expect(result).toEqual({ message: 'Si el correo existe, te llegó un código.' });
  });

  it('responde con el mensaje genérico aunque falle el envío del correo', async () => {
    const { service, mailService } = buildService();
    mailService.sendPasswordResetCode.mockRejectedValue(new Error('resend down'));

    const result = await service.forgotPassword('ana@example.com');

    expect(result).toEqual({ message: 'Si el correo existe, te llegó un código.' });
  });

  it('no reenvía si ya hay un código pedido hace menos de 60s', async () => {
    const { service, prisma, mailService } = buildService({
      existingCode: {
        id: 'code-0',
        createdAt: new Date(Date.now() - 10_000),
        expiresAt: new Date(Date.now() + 14 * 60_000),
      },
    });

    await service.forgotPassword('ana@example.com');

    expect(prisma.passwordResetCode.create).not.toHaveBeenCalled();
    expect(mailService.sendPasswordResetCode).not.toHaveBeenCalled();
  });
});

describe('AuthService · resetPassword', () => {
  it('actualiza la contraseña con un código válido', async () => {
    const codeHash = await bcrypt.hash('123456', 10);
    const { service, prisma } = buildService({
      existingCode: { id: 'code-1', codeHash, attempts: 0, expiresAt: new Date(Date.now() + 60_000) },
    });

    const result = await service.resetPassword('ana@example.com', '123456', 'NuevaPass123');

    expect(prisma.$transaction).toHaveBeenCalled();
    expect(result).toEqual({ message: 'Contraseña actualizada.' });
  });

  it('rechaza un código incorrecto e incrementa attempts atómicamente', async () => {
    const codeHash = await bcrypt.hash('123456', 10);
    const { service, prisma } = buildService({
      existingCode: { id: 'code-1', codeHash, attempts: 0, expiresAt: new Date(Date.now() + 60_000) },
      updateResult: { attempts: 1 },
    });

    await expect(service.resetPassword('ana@example.com', '000000', 'NuevaPass123')).rejects.toThrow(
      BadRequestException,
    );
    expect(prisma.passwordResetCode.update).toHaveBeenCalledTimes(1);
    expect(prisma.passwordResetCode.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'code-1' },
        data: expect.objectContaining({ attempts: { increment: 1 } }),
      }),
    );
  });

  it('invalida el código al llegar a 5 intentos fallidos', async () => {
    const codeHash = await bcrypt.hash('123456', 10);
    const { service, prisma } = buildService({
      existingCode: { id: 'code-1', codeHash, attempts: 4, expiresAt: new Date(Date.now() + 60_000) },
      updateResult: { attempts: 5 },
    });

    await expect(service.resetPassword('ana@example.com', '000000', 'NuevaPass123')).rejects.toThrow(
      BadRequestException,
    );
    expect(prisma.passwordResetCode.update).toHaveBeenCalledTimes(2);
    expect(prisma.passwordResetCode.update).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        where: { id: 'code-1' },
        data: expect.objectContaining({ attempts: { increment: 1 } }),
      }),
    );
    expect(prisma.passwordResetCode.update).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        where: { id: 'code-1' },
        data: expect.objectContaining({ usedAt: expect.any(Date) }),
      }),
    );
  });

  it('rechaza un código expirado', async () => {
    const codeHash = await bcrypt.hash('123456', 10);
    const { service } = buildService({
      existingCode: { id: 'code-1', codeHash, attempts: 0, expiresAt: new Date(Date.now() - 1000) },
    });

    await expect(service.resetPassword('ana@example.com', '123456', 'NuevaPass123')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('rechaza si no hay ningún código pedido', async () => {
    const { service } = buildService({ existingCode: null });

    await expect(service.resetPassword('ana@example.com', '123456', 'NuevaPass123')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('da el mismo mensaje genérico si el usuario no existe o si no tiene código vigente', async () => {
    const { service: serviceNoUser } = buildService({ user: null });
    const { service: serviceNoCode } = buildService({ existingCode: null });

    let messageForNoUser = '';
    let messageForNoCode = '';
    try {
      await serviceNoUser.resetPassword('nadie@example.com', '123456', 'NuevaPass123');
    } catch (err) {
      messageForNoUser = (err as BadRequestException).message;
    }
    try {
      await serviceNoCode.resetPassword('ana@example.com', '123456', 'NuevaPass123');
    } catch (err) {
      messageForNoCode = (err as BadRequestException).message;
    }

    expect(messageForNoUser).toBe(messageForNoCode);
    expect(messageForNoUser).not.toBe('');
  });
});
