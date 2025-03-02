import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Injectable()
export class NullValidationPipe implements PipeTransform {
  private static isObj(obj: any): boolean {
    return typeof obj === 'object' && obj !== null;
  }

  private dropNull(values) {
    Object.keys(values).forEach((key) => {
      if (!(key === 'password' || key === '_id')) {
        if (NullValidationPipe.isObj(values[key])) {
          values[key] = this.dropNull(values[key]);
        } else if (Array.isArray(values[key]) && values[key].length > 0) {
          values[key] = values[key].map((value) => {
            if (NullValidationPipe.isObj(value)) {
              value = this.dropNull(value);
            }
            return value;
          });
        } else {
          if (values[key] === null || values[key] === undefined) {
            delete values[key];
          }
        }
      }
    });
    return values;
  }

  transform(values: any, metadata: ArgumentMetadata) {
    try {
      const { type } = metadata;
      if (type === 'param' || type === 'custom') return values;
      else if (NullValidationPipe.isObj(values) && type === 'body') {
        return this.dropNull(values);
      }
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }
}
