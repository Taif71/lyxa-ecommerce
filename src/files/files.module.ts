import { Module } from '@nestjs/common';
import { AwsS3Controller, LocalStorageController } from './controllers';
import { AwsS3Service, LocalStorageService } from './services';
import { FilesController } from './controllers/files.controller';
import { FilesService } from './services/files.service';
import { DOSpaceService } from './services/do-space.service';
import { DOSpaceServicerPovider } from './helper/do-space.helper';

@Module({
  controllers: [AwsS3Controller, LocalStorageController, FilesController],
  providers: [
    DOSpaceService,
    AwsS3Service,
    LocalStorageService,
    FilesService,
    DOSpaceServicerPovider,
  ],
})
export class FilesModule {}
