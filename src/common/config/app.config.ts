import { INestApplication, ValidationPipe } from "@nestjs/common";
import { HttpExceptionFilter } from "../filters/http-exception.filter";

export const AppConfig = (app: INestApplication) => {
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.useGlobalFilters(new HttpExceptionFilter());
    
} 