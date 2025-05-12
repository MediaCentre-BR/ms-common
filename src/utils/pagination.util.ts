import { IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ObjectLiteral, Repository } from 'typeorm';

export class PaginationDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit: number = 10;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    totalPages: number;
  };
}

export async function paginate<T extends ObjectLiteral>(
  repository: Repository<T>,
  { page, limit }: PaginationDto,
): Promise<PaginatedResponse<T>> {
  const skip = (page - 1) * limit;

  const [data, total] = await repository.findAndCount({
    skip,
    take: limit,
  });

  return {
    data,
    meta: {
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}
