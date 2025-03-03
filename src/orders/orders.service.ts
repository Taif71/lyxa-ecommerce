import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SCHEMA } from 'src/common/mock';
import { IUser } from 'src/users/interfaces';
import { createSearchQuery, createSelectQuery, slug } from 'src/common/utils/helper';
import { IOrder } from './interfaces';
import { CreateOrderDto, OrderDto, SearchOrderDto, UpdateOrderDto } from './dto';


@Injectable()
export class OrdersService {
     /**
       * Constructor
       * @param {Model<IProduct>} model       
       */
      constructor(
        @InjectModel(SCHEMA.ORDER)
        private readonly model: Model<IOrder>,        
      ) {}


    /**
       * Create order
       * @param {IUser} user
       * @param {CreateOrderDto} data
       * @returns {Promise<IOrder>}
    */
      async create(
        data: CreateOrderDto,
        user: IUser,        
      ): Promise<IOrder> {
        try {                        
          const body = new OrderDto({
            ...data,           
          });
          const registerDoc = new this.model(body);
    
          return await registerDoc.save();
        } catch (err) {
          throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST, {
            cause: new Error(err),
          });
        }
      }


    /**
       * Find All orders
       * @param {SearchProductDto} query
       * @returns {Promise<IOrder>}
       */
      async findAll(query: SearchOrderDto): Promise<any> {
        try {
          const searchQuery = createSearchQuery(query);
          const limit: number = (query && query.limit) || 10;
          const skip: number = (query && query.skip) || 0;
    
          const cursor = !query.getAllRecord
            ? this.model.find(searchQuery).limit(limit).skip(skip)
            : this.model.find(searchQuery);
    
          const populations = [
            'owner',
            'category',
            'subCategory',
          ];
          if (query && query.select) {
            const { select, populationPathMap } = createSelectQuery(
              query,
              populations,
            );
            cursor.select(select);
            Object.keys(populationPathMap).forEach((key) => {
              if (Object.keys(populationPathMap[key]['select']).length > 0)
                cursor.populate(populationPathMap[key]);
            });
          } else {
            populations.map((item) => {
              cursor.populate(item);
            });
          }
    
          if (query.hasOwnProperty('sort') && query.sort) {
            cursor.sort(JSON.parse(query.sort));
          } else {
            cursor.sort({ $natural: 1 });
          }
    
          let data: IOrder[] = await cursor.exec();
    
          if (query.user) {
            data.forEach((doc) => {
              doc['_doc'].currentUser = query.user._id;
            });
          }
    
          const result: any = {
            data,
          };
    
          if (query.pagination) {
            result.pagination = {
              total: await this.count(searchQuery),
              limit,
              skip,
            };
          }
          return result;
        } catch (err) {
          throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST, {
            cause: new Error(err),
          });
        }
      }

    /**
       * Find one Order
       * @param {string} id
       * @returns {Promise<IProduct>}
       */
      async findOne(id: string): Promise<IOrder> {
        try {
          const res = await this.model.findOne({ _id: id });
          if (!res) {
            return Promise.reject(new NotFoundException('Could not find product.'));
          }
          return res;
        } catch (err) {
          throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST, {
            cause: new Error(err),
          });
        }
      }

    /**
       * Update Order
       * @param {IUser} user
       * @param {string} id
       * @param {UpdateOrderDto} data
       * @returns {Promise<IOrder>}
       */
      async update(
        id: string,
        data: UpdateOrderDto,
        user: IUser
      ): Promise<IOrder> {
        try {
          const record = await this.model.findOne({
            _id: id,
            isDeleted: false,
          });
          if (!record) {
            return Promise.reject(new NotFoundException('Could not find order.'));
          }
          const body = new OrderDto({
            ...data,
            uBy: user._id,
          });          
    
          return (await record.set(body).save());
        } catch (err) {
          throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST, {
            cause: new Error(err),
          });
        }
      }

    /**
       * count orders
       * @returns {Promise<number>}
       */
     private async count(query: SearchOrderDto): Promise<number> {
        try {
          const searchQuery = createSearchQuery(query);
          return this.model.countDocuments(searchQuery);
        } catch (err) {
          throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST, {
            cause: new Error(err),
          });
        }
      }
    
}
