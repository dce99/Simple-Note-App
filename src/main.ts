import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import { ValidationGlobalPipe } from './core/pipes/globalValidation.pipe';
import { AllExceptionsFilter } from './core/exception_filters/allExceptionFilter';
import { ExcludeNullInterceptor } from './core/interceptors/excludeNull.interceptor';
// import * as helmet from 'helmet';


async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api');

  // pipes, filters and interceptors
  app.useGlobalPipes(new ValidationGlobalPipe({
    transform: true
  }));
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new ExcludeNullInterceptor());

  // swagger
  const options = new DocumentBuilder()
    .setTitle('Speer Test API')
    .setDescription('Speer Test description')
    .setVersion('1.0')
    .addTag('Spper')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'Token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  
  // security.
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.enableCors()
  app.disable('x-powered-by');
  // app.use(helmet());
  // app.use(csurf());


  app.listen(process.env.PORT, () => {
    console.log(`Server running at ${process.env.HOST}/`);
    if (process.env.NODE_ENV == "production")
      console.log = function () { }
  });



}
bootstrap();
