import { BaseDatabase } from "./BaseDataBase";
import { Service } from "../types/index";

export class ServiceDatabase extends BaseDatabase {
    public static TABLE_SERVICES = "services";

    public async getAllServices(): Promise<Service[]> {
        const services: Service[] = await BaseDatabase
            .connection(ServiceDatabase.TABLE_SERVICES)
            .select();
        
        return services;
    }

    public async createService(newService: Service): Promise<void> {
        await BaseDatabase
            .connection(ServiceDatabase.TABLE_SERVICES)
            .insert(newService);
    }

    public async getServiceByName(name: string): Promise<Service | undefined> {
        const service: Service | undefined = await BaseDatabase
            .connection(ServiceDatabase.TABLE_SERVICES)
            .where({ name })
            .first();
        
        return service;
    }

    public async getServiceById(id: string): Promise<Service | undefined> {
        const service: Service | undefined = await BaseDatabase
            .connection(ServiceDatabase.TABLE_SERVICES)
            .where({ id })
            .first();
        
        return service;
    }

    public async editService(id: string, updatedService: Partial<Service>): Promise<void> {
        await BaseDatabase
            .connection(ServiceDatabase.TABLE_SERVICES)
            .where({ id })
            .update(updatedService);
    }

    public async deleteService(id: string): Promise<void> {
        await BaseDatabase
            .connection(ServiceDatabase.TABLE_SERVICES)
            .where({ id })
            .delete();
    }
}
