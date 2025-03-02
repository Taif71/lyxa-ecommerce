import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Injectable()
export class TrimPipe implements PipeTransform {
  private isObj(obj: any): boolean {
    return typeof obj === 'object' && obj !== null;
  }

  private trim(values) {
    Object.keys(values).forEach((key) => {
      if (!(key === 'password' || key === '_id')) {
        if (this.isObj(values[key])) {
          values[key] = this.trim(values[key]);
        } else {
          if (typeof values[key] === 'string') {
            values[key] = values[key].trim();
          }
        }
      }
    });
    return values;
  }

  transform(values: any, metadata: ArgumentMetadata) {
    try {
      const { type } = metadata;

      if (type === 'param' || type === 'custom' || type === 'query')
        return values;
      else if (this.isObj(values) && type === 'body') {
        return this.trim(values);
      }
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }
}
