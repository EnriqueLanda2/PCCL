import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly config: ConfigService) {}

  async dashboard() {
    const [identitySummary, learningSummary, certificationSummary] =
      await Promise.all([
        this.fetchJson<Record<string, number>>('/summary', 'IDENTITY_SERVICE_URL', 'http://localhost:4001'),
        this.fetchJson<Record<string, number>>('/summary', 'LEARNING_SERVICE_URL', 'http://localhost:4002'),
        this.fetchJson<Record<string, number>>('/summary', 'CERTIFICATION_SERVICE_URL', 'http://localhost:4003'),
      ]);

    return {
      users: identitySummary.users ?? 0,
      courses: learningSummary.courses ?? 0,
      lessons: learningSummary.lessons ?? 0,
      publishedCourses: learningSummary.publishedCourses ?? 0,
      draftCourses: learningSummary.draftCourses ?? 0,
      certificates: certificationSummary.certificates ?? 0,
      auditLogs: certificationSummary.auditLogs ?? 0,
    };
  }

  health() {
    return {
      service: 'gateway',
      status: 'ok',
      port: this.config.get<number>('PORT', 4000),
    };
  }

  private async fetchJson<T>(
    path: string,
    envKey: string,
    defaultUrl: string,
  ): Promise<T> {
    const baseUrl = this.config.get<string>(envKey, defaultUrl);
    const response = await fetch(new URL(path, baseUrl));

    if (!response.ok) {
      throw new Error(`Request failed for ${baseUrl}${path}`);
    }

    return (await response.json()) as T;
  }
}
