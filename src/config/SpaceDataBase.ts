import { BaseDatabase } from "./BaseDataBase";
import { Space } from "../types/index";

export class SpaceDatabase extends BaseDatabase {
    public static TABLE_SPACES = "spaces";

    public async getAllSpaces(): Promise<Space[]> {
        const spaces: Space[] = await BaseDatabase
            .connection(SpaceDatabase.TABLE_SPACES)
            .select();
        
        return spaces;
    }

    public async createSpace(newSpace: Space): Promise<void> {
        await BaseDatabase
            .connection(SpaceDatabase.TABLE_SPACES)
            .insert(newSpace);
    }

    public async getSpaceByName(name: string): Promise<Space | undefined> {
        const space: Space | undefined = await BaseDatabase
            .connection(SpaceDatabase.TABLE_SPACES)
            .where({ name })
            .first();
        
        return space;
    }

    public async getSpaceById(id: string): Promise<Space | undefined> {
        const space: Space | undefined = await BaseDatabase
            .connection(SpaceDatabase.TABLE_SPACES)
            .where({ id })
            .first();
        
        return space;
    }
}
