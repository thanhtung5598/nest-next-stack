import { NestInterceptor, ExecutionContext, CallHandler, UseInterceptors } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

export interface ClassConstructor {
  new (...args: any[]): object;
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor) {}

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    // run something before a request is handled by the request handler

    return handler.handle().pipe(
      map((data: ClassConstructor) => {
        // Run something before the response is sent out

        return plainToClass(this.dto, data, {
          excludeExtraneousValues: true, // remove fields that are not in the DTO
          exposeUnsetFields: false, // remove fields with value of undefined
        });
      }),
    );
  }
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}
