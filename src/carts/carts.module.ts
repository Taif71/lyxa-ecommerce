import { Module } from '@nestjs/common';
import { CartsController } from './carts.controller';
import { CartsService } from './carts.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SCHEMA } from 'src/common/mock';
import { CartSchema } from './schemas';

@Module({
  imports: [
      ConfigModule.forRoot(),
      MongooseModule.forFeature([
        { name: SCHEMA.CATEGORY, schema: CartSchema },
      ]),
    ],
  controllers: [CartsController],
  providers: [CartsService]
})
export class CartsModule {}
