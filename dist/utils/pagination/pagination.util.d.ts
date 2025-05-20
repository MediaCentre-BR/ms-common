import { ObjectLiteral, Repository } from 'typeorm';
import { PaginationDto } from 'src/types/pagination.dto';
import { PaginatedResponse } from 'src/types/pagination-response.types';
export declare function paginate<T extends ObjectLiteral>(repository: Repository<T>, { page, limit }: PaginationDto): Promise<PaginatedResponse<T>>;
