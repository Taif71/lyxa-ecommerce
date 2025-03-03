import {
  HttpStatus,
  Controller,
  Body,
  Delete,
  Get,
  HttpException,
  MethodNotAllowedException,
  Patch,
  Post,
  Put,
  UseGuards,
  UsePipes,
  Param,
  Query,
  UploadedFiles,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiResponse,
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiHeader,
  ApiOperation,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { TrimPipe } from 'src/common/pipes';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IUser } from 'src/users/interfaces';
import { User } from 'src/common/decorators';
import { CreateOrderDto, SearchOrderDto, UpdateOrderDto } from './dto';
import { IOrder } from './interfaces';


@ApiTags('Order')
@ApiResponse({
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  description: 'Server Error!',
})
@Controller('orders')
export class OrdersController {
  /**
   * Constructor
   * @param {OrdersService} service
   */
  constructor(private readonly orderService: OrdersService) {}

  /**
     * Product create
     * @Body {CreateOrderDto} data
     * @user {IUser} user
     * @returns {Promise<IProduct>}
     */
    @ApiOperation({ summary: 'Order creation' })
    @ApiBearerAuth()
    @ApiHeader({
      name: 'Authorization',
      description: 'Bearer Token',
    })
    @ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Return Order.',
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Invalid data',
    })
    @ApiResponse({
      status: HttpStatus.NOT_ACCEPTABLE,
      description: 'Record already exist',
    })    
    @UsePipes(new TrimPipe())
    @UseGuards(JwtAuthGuard)
    @ApiConsumes('multipart/form-data')
    // @ApiBody({ type: ProductFileUploadDto })
    @UseInterceptors(
      FileFieldsInterceptor([
        { name: 'images', maxCount: 4 },
        { name: 'videos', maxCount: 4 },
      ]),
    )
    @Post()
    create(
      @User() user: IUser,
      @Body() data: CreateOrderDto      
    ): Promise<IOrder> {
      try {
        return this.orderService.create(data, user);
      } catch (err) {
        throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST, {
          cause: new Error(err),
        });
      }
    }

    /**
       * find all orders
       * @returns {Promise<IOrder[]>}
       */
    @ApiOperation({ summary: 'Get all orders' })
    @Get()
    public findAll(
        @Query() query: SearchOrderDto,
        @User() user?: IUser,
      ): Promise<IOrder[]> {
        try {
          if (user) {
            query.user = user;
          }
          return this.orderService.findAll(query);
        } catch (err) {
          throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST, {
            cause: new Error(err),
          });
        }
    }

    /**
       * @Param {string} id
       * @returns {Promise<IProduct>}
       */
      @ApiOperation({ summary: 'Get order from id' })
      @ApiResponse({ status: 200, description: 'Return order information.' })
      @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'User Not found.',
      })
      @Get(':id')
      public async getOne(@Param('id') id: string): Promise<IOrder> {
        try {
          return await this.orderService.findOne(id);
        } catch (err) {
          throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST, {
            cause: new Error(err),
          });
        }
      }

    @ApiOperation({ summary: 'Order update' })
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Authorization',
        description: 'Bearer Token',
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Return Order.',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid data',
    })    
    @UsePipes(new TrimPipe())
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(
        @User() user: IUser,
        @Param('id') id: string,
        @Body() data: UpdateOrderDto,
    ): Promise<IOrder> {
        try {
            return this.orderService.update(id, data, user);
        } catch (err) {
            throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST, {
                cause: new Error(err),
            });
        }
    }


}
