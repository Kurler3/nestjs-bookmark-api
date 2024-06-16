import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService extends PrismaClient {

    constructor() {
        // Calls the constructor of the prisma client
        super({
            datasources: {
                db: {
                    url: "postgresql://postgres:123@localhost:5434/nest?schema=public",  // process.env.DATABASE_URL
                }
            }
        });
    }

}
