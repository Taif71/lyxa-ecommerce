import { SearchQueryDto } from '../../common/dto';

export class SearchCategoryDto
    extends SearchQueryDto
    implements Readonly<SearchCategoryDto>
{}
