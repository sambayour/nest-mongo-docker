import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ResponseModel } from '../../utils/response-model';

@Injectable()
export class ResponseTransformInterceptor<T>
  implements NestInterceptor<T, ResponseModel<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseModel<T>> {
    let response;

    return next.handle().pipe(
      map((incomingResponse: any) => {
        if (incomingResponse instanceof ResponseModel) {
          response = incomingResponse;
        } else if (incomingResponse instanceof Error) {
          response = {
            statusCode: 500,
            message: 'An Error occurred',
            data: null,
          };
        } else if (incomingResponse instanceof HttpException) {
          response = {
            statusCode: 500,
            message: 'An Error occurred',
            data: null,
          };
        } else if (!incomingResponse) {
          response = {
            statusCode: 500,
            message: 'An Error occurred',
            data: null,
          };
        } else if (
          (incomingResponse &&
            incomingResponse.stack &&
            incomingResponse.message) ||
          (incomingResponse.statusCode && incomingResponse.statusCode !== 200)
        ) {
          response = {
            statusCode: 500,
            message: 'An Error occurred',
            data: incomingResponse.data || incomingResponse.message,
          };
        } else {
          response = {
            statusCode: 200,
            message: 'Operation successful',
            data: incomingResponse,
          };
        }

        return response;
      }),
    );
  }
}
