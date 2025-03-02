import { ApiProperty } from '@nestjs/swagger';
import * as moment from 'moment-timezone';

export class BaseDto implements Readonly<BaseDto> {
    @ApiProperty()
    isActive: boolean;

    @ApiProperty()
    isDeleted: boolean;

    @ApiProperty()
    cTime: number;

    @ApiProperty()
    cBy: string;

    @ApiProperty()
    uTime: number;

    @ApiProperty()
    uBy: string;

    @ApiProperty({
        required: false
    })
    timezone: string;

    constructor(data?: any) {
        if (data) {
            data.hasOwnProperty("isActive") && (this.isActive = data.isActive);
            data.hasOwnProperty("isDeleted") && (this.isDeleted = data.isDeleted);
            const time =
                (data?.timezone &&
                    moment().tz(data.timezone).valueOf()) ||
                Date.now();
            data.cBy && (this.cBy = data.cBy) && (this.cTime = time);
            data.uBy && (this.uBy = data.uBy) && (this.uTime = time);
        }
    }
}
