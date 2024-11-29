import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ApiResponse } from 'src/common/interfaces/api-response.interface';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map(body => {
        const response = context.switchToHttp().getResponse();
        return {
          statusCode: response.statusCode,
          message: 'Request was succesful',
          data: body
        }
      })
    );
  }
}
