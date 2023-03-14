import { MikroORM } from '@mikro-orm/core';
import { singleton } from 'tsyringe';
import { City } from '../entities/city';

@singleton()
export class CityService {
    private cityRepository;
    constructor(private ormClient: MikroORM) {
        this.cityRepository = ormClient.em.getRepository(City);
    }

    async getCities() {
        const cities = await this.cityRepository.find({}, { fields: ['id', 'name', 'slug'] });
        return cities;
    }
}
