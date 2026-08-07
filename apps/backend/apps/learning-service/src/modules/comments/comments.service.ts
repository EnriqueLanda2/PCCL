import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PrismaService } from '../../prisma/prisma.service';
import { IDENTITY_CLIENT } from '@app/messaging';
import { buildUserDirectory } from '../../common/user-directory';

/**
 * Comentarios de alumnos en un curso.
 *
 * El texto lo escribe el usuario, así que se recorta y se limita en longitud
 * antes de guardarlo. El autor se resuelve contra identity-service al leer,
 * igual que en Inscription: aquí solo se guarda su UUID.
 */
const MAX_LENGTH = 1000;

@Injectable()
export class CommentsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(IDENTITY_CLIENT) private readonly identityClient: ClientProxy,
  ) {}

  async findByCourse(courseId: string, viewerId: string) {
    const [comments, directory] = await Promise.all([
      this.prisma.courseComment.findMany({
        where: { courseId },
        orderBy: { createdAt: 'desc' },
      }),
      buildUserDirectory(this.identityClient),
    ]);

    return comments.map((c) => {
      const author = directory.get(c.userId);
      return {
        id: c.id,
        courseId: c.courseId,
        content: c.content,
        createdAt: c.createdAt,
        /* Solo el nombre: el correo del autor no tiene por qué ser público. */
        authorName: author?.fullName ?? 'Alumno',
        authorId: c.userId,
        likes: c.likedBy.length,
        likedByMe: c.likedBy.includes(viewerId),
        mine: c.userId === viewerId,
      };
    });
  }

  async create(courseId: string, userId: string, content: string, actor: string) {
    const body = (content ?? '').trim();
    if (!body) throw new ForbiddenException('El comentario está vacío');

    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true },
    });
    if (!course) throw new NotFoundException('Curso no encontrado');

    /* Comentar exige estar inscrito: evita que cualquiera escriba en cursos
       que no cursa. */
    const enrolled = await this.prisma.inscription.findFirst({
      where: { userId, courseId },
      select: { id: true },
    });
    if (!enrolled) throw new ForbiddenException('Debes estar inscrito para comentar');

    await this.prisma.courseComment.create({
      data: {
        courseId,
        userId,
        content: body.slice(0, MAX_LENGTH),
        createdBy: actor,
        updatedBy: actor,
      },
    });

    return this.findByCourse(courseId, userId);
  }

  /** Alterna el "me gusta" del usuario sobre un comentario. */
  async toggleLike(commentId: string, userId: string) {
    const comment = await this.prisma.courseComment.findUnique({
      where: { id: commentId },
    });
    if (!comment) throw new NotFoundException('Comentario no encontrado');

    const liked = comment.likedBy.includes(userId);
    const likedBy = liked
      ? comment.likedBy.filter((id) => id !== userId)
      : [...comment.likedBy, userId];

    await this.prisma.courseComment.update({
      where: { id: commentId },
      data: { likedBy },
    });

    return { id: commentId, likes: likedBy.length, likedByMe: !liked };
  }

  /** Solo el autor puede borrar su comentario. */
  async remove(commentId: string, userId: string) {
    const comment = await this.prisma.courseComment.findUnique({
      where: { id: commentId },
      select: { id: true, userId: true, courseId: true },
    });
    if (!comment) throw new NotFoundException('Comentario no encontrado');
    if (comment.userId !== userId)
      throw new ForbiddenException('Solo puedes borrar tus propios comentarios');

    await this.prisma.courseComment.delete({ where: { id: commentId } });
    return { id: commentId, deleted: true };
  }
}
