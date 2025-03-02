import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SCHEMA } from '../common/mock';
import { ProductsController } from './controllers';
import { ProductsService } from './services';
import { ProductSchema } from './schemas';
import {
  FilesService,
  LocalStorageService,
  AwsS3Service,
  DOSpaceService,
} from '../files/services';
import { DOSpaceServicerPovider } from '../files/helper/do-space.helper';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: SCHEMA.PRODUCT, schema: ProductSchema },
    ]),
  ],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    FilesService,
    LocalStorageService,
    AwsS3Service,
    DOSpaceService,
    DOSpaceServicerPovider,
  ],
})
export class ProductsModule {}
