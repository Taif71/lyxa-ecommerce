import { SearchQueryDto } from '../../common/dto';

export class SearchOrderDto
    extends SearchQueryDto
    implements Readonly<SearchOrderDto>
{}
