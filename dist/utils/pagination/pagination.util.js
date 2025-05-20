"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginate = paginate;
async function paginate(repository, { page, limit }) {
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
//# sourceMappingURL=pagination.util.js.map