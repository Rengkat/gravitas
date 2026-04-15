import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const nodeEnv = 'production';
  const port = 3000;
  // const port = config.get<number>('app.port', 5000);
  // const nodeEnv = config.get<string>('app.nodeEnv', 'development');
  // const frontendUrl = config.get<string>(
  //   'app.frontendUrl',
  //   'http://localhost:3000',
  // );

  //======== Global prefix ==========
  app.setGlobalPrefix('api/v1');

  //======== Validation pipe =========
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip unknown fields
      forbidNonWhitelisted: false, // don't throw on extra fields
      transform: true, // auto-transform types
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // ── Swagger (dev + staging only) ──────────
  if (nodeEnv !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Gravitas API')
      .setDescription(
        'Nigerian EdTech SaaS — JAMB, WAEC, ICAN exam prep + AI tutoring + school portal',
      )
      .setVersion('1.0')
      .addBearerAuth()
      .addServer(`http://localhost:${port}`, 'Local')
      .addServer('https://api.gravitas.ng', 'Production')
      .addTag('Auth', 'Registration, login, OTP, password reset')
      .addTag('Users', 'User profile management')
      .addTag('CBT', 'Exam sessions, questions, timer')
      .addTag('AI', 'Sabi-Explain, Sabi-Tutor chat, essay marking')
      .addTag('School', 'School portal, tests, student management')
      .addTag('Tutors', 'Tutor discovery and session booking')
      .addTag('Payments', 'Paystack payments and subscriptions')
      .addTag('Library', 'Video lessons and PDF content')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
      },
    });
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
