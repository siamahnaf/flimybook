import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from "@nestjs/common";

//App Module
import { AppModule } from "./app.module";

//Config service
const configService = new ConfigService();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: ["http://localhost:3000", "https://flimybook.siamahnaf.com", "https://flimybook.vercel.app/"],
      credentials: true
    }
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(configService.get<number>("PORT") || 3001);
}

bootstrap();
