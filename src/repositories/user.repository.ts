import { User } from "@/entities/user";
import { dataSource } from "@/app.init";
import { FindManyOptions } from "typeorm";
import { LIMIT_PER_PAGE } from "@/constants/common.const";
import { Pagination } from "@/models";

const UserRepository = dataSource.getRepository(User).extend({
  findById(id: number) {
    return this.findOne({ where: { id } });
  },
  async insertOrUpdate(entity: User) {
    try {
      if (entity.id) {
        return this.save(entity, { reload: false });
      }
      const res = await this.createQueryBuilder()
        .insert()
        .into(User)
        .values(entity)
        .updateEntity(false)
        .execute();
      entity.id = res.raw.insertId;
      return entity;
    } catch (error) {
      return null;
    }
  },
  async bulkInsert(entities: User[]) {
    try {
      const res = await this.createQueryBuilder()
        .insert()
        .into(User)
        .values(entities)
        .updateEntity(false)
        .execute();
      let newId = Number(res.raw?.insertId);
      return entities.map((item) => {
        item.id = newId;
        newId++;
        return item;
      });
    } catch (error) {
      return null;
    }
  },
  async paginate(
    options?: FindManyOptions<User>,
    page = 1,
    limit = LIMIT_PER_PAGE,
  ) {
    const skip = (page - 1) * limit;
    const [records, count] = await this.findAndCount({
      skip,
      take: limit,
      ...options,
    });
    const lastPage = count < limit ? 1 : Math.ceil(count / limit);

    return {
      data: records,
      page,
      limit,
      lastPage,
      total: count,
    };
  },
  basicGeneratePagination(page: any, limit: any, count: any): Pagination {
    const lastPage = count < limit ? 1 : Math.ceil(count / limit);
    return {
      page,
      limit,
      lastPage,
      total: count,
    };
  },
});

export default UserRepository;
