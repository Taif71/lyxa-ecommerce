import {
  Injectable,
  ArgumentMetadata,
  PipeTransform,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform {
  skip = true;
  constructor(skip = false) {
    this.skip = skip;
  }

  async transform(value: any, metadata: ArgumentMetadata) {
    const { type } = metadata;
    if (value instanceof Object && this.isEmpty(value)) {
      return value;
    }

    if (type !== 'custom' && value instanceof Object && this.isEmpty(value)) {
      throw new HttpException(
        'Validation failed: No body submitted',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { metatype } = metadata;
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);
    const errors = await validate(object, { skipMissingProperties: this.skip, forbidUnknownValues:false });
    if (errors.length > 0) {
      throw new HttpException(
        `Validation failed: ${this.formatErrors(errors)}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return object;
  }

  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.find((type) => metatype === type);
  }

  private formatErrors(errors: any[]) {
    return errors
      .map((err) => {
        for (const property in err.constraints) {
          return err.constraints[property];
        }
      })
      .join(', ');
  }

  private isEmpty(value: any) {
    if (Object.keys(value).length > 0) {
      return false;
    }
    return true;
  }
}
