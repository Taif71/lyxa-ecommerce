import { SearchQueryDto } from '../../common/dto';

export class SearchProductDto
    extends SearchQueryDto
    implements Readonly<SearchProductDto>
{}
