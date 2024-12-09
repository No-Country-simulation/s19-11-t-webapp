// src/main.ts
import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle("Patient Clinical Records Microservice")
    .setDescription("Microservice for managing patient medical records")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: "http://localhost:5173", // Origen permitido
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Métodos permitidos
    credentials: true, // Permitir cookies o headers como Authorization
  });

  await app.listen(3005);
}
bootstrap();
