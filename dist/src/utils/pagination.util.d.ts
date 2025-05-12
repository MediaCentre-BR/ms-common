import { ObjectLiteral, Repository } from 'typeorm';
export declare class PaginationDto {
    page: number;
    limit: number;
}
export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        page: number;
        limit: number;
        totalPages: number;
    };
}
export declare function paginate<T extends ObjectLiteral>(repository: Repository<T>, { page, limit }: PaginationDto): Promise<PaginatedResponse<T>>;
