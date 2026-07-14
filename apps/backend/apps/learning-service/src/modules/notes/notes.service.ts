import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNoteDto } from './dtos/create-note.dto';
import { UpdateNoteDto } from './dtos/update-note.dto';

@Injectable()
export class NotesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateNoteDto, actor: string) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id: dto.lessonId } });
    if (!lesson) throw new NotFoundException('Leccion no encontrada');
    const note = await this.prisma.note.create({
      data: { content: dto.content, lessonId: dto.lessonId, createdBy: actor, updatedBy: actor },
    });
    return note;
  }

  findByLesson(lessonId: string) {
    return this.prisma.note.findMany({ where: { lessonId }, orderBy: { createdAt: 'asc' } });
  }

  async findOne(id: string) {
    const note = await this.prisma.note.findUnique({ where: { id } });
    if (!note) throw new NotFoundException('Nota no encontrada');
    return note;
  }

  async update(id: string, dto: UpdateNoteDto, actor: string) {
    const note = await this.findOne(id);
    if (note.createdBy !== actor) throw new ForbiddenException('Solo el autor puede editar esta nota');
    await this.prisma.note.update({ where: { id }, data: { content: dto.content, updatedBy: actor } });
    return this.findOne(id);
  }

  async remove(id: string, actor: string) {
    const note = await this.findOne(id);
    if (note.createdBy !== actor) throw new ForbiddenException('Solo el autor puede eliminar esta nota');
    await this.prisma.note.delete({ where: { id } });
    return { id, deleted: true };
  }
}
