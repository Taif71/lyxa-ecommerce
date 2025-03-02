import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Base } from '../../common/schemas';
import {
    MediaDocument,
    MediaSchema,
} from '../../common/schemas';
import { SCHEMA } from '../../common/mock';

export type CategoryDocument = Category & Document;

@Schema({
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
})
export class Category extends Base {
    @Prop({ required: true, unique: true })
    name: string;

    @Prop({
        type: SchemaTypes.ObjectId,
        ref: SCHEMA.CATEGORY,
    })
    parentCategory: CategoryDocument

    @Prop({
        type: MediaSchema,
    })
    image: MediaDocument;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        return {
            _id: ret._id,
            name: ret.name,
            parentCategory: ret.parentCategory,
            image: ret.image,
            isActive: ret.isActive,
            isDeleted:ret.isDeleted
        };
    },
});
