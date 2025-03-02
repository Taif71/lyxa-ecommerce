import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  status: string;
  data: T;
  message: string;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((res) => {
        const result = res && res?.data ? res.data : res;
        const pagination = res && res.pagination ? res.pagination : null;
        return {
          status: 'SUCCESS',
          data: result || '',
          message: res.message || '',
          pagination,
        };
      }),
    );
  }
}
