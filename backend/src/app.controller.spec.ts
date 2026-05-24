import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  const metrics = {
    users: 4,
    courses: 3,
    lessons: 12,
    publishedCourses: 2,
    draftCourses: 1,
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            dashboard: jest.fn().mockResolvedValue(metrics),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('dashboard', () => {
    it('should return metrics', async () => {
      await expect(appController.dashboard()).resolves.toEqual(metrics);
    });
  });
});
