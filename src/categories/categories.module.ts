import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesController } from './controllers';
import { CategoriesService } from './services';
import { SCHEMA } from '../common/mock';
import { CategorySchema } from './schemas';
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
      { name: SCHEMA.CATEGORY, schema: CategorySchema },
    ]),
  ],
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    FilesService,
    LocalStorageService,
    AwsS3Service,
    DOSpaceService,
    DOSpaceServicerPovider
  ]
})
export class CategoriesModule { }
