import { ObjectLiteral, Repository } from 'typeorm';
import { PaginationDto } from 'src/types/pagination.dto';
import { PaginatedResponse } from 'src/types/pagination-response.types';

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
