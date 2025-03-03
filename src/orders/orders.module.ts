import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SCHEMA } from '../common/mock';

import {
  FilesService,
  LocalStorageService,
  AwsS3Service,
  DOSpaceService,
} from '../files/services';
import { DOSpaceServicerPovider } from '../files/helper/do-space.helper';
import { OrderSchema } from './schemas/orders.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: SCHEMA.ORDER, schema: OrderSchema },
    ]),
  ],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    FilesService,
    LocalStorageService,
    AwsS3Service,
    DOSpaceService,
    DOSpaceServicerPovider,
  ],
})
export class OrdersModule {}

