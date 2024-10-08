import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, map } from "rxjs";
import { recursivelyStripNullValues } from "../utils/recursivelyStripNullValues";

@Injectable()
export class ExcludeNullInterceptor implements NestInterceptor{
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    return next
      .handle()
      .pipe(map(value => recursivelyStripNullValues(value)));
  }
}