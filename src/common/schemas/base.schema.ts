import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BaseDocument = Base & Document;

@Schema()
export class Base {
    @Prop({ default: true })
    isActive: boolean;

    @Prop({ default: false })
    isDeleted: boolean;

    @Prop({ default: Date.now() })
    cTime: number;

    @Prop()
    cBy: string;

    @Prop()
    uTime: number;

    @Prop()
    uBy: string;
}

export const BaseSchema = SchemaFactory.createForClass(Base);
