import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService extends PrismaClient {

    constructor(private configService: ConfigService) {
        // Calls the constructor of the prisma client
        super({
            datasources: {
                db: {
                    url: configService.get('DATABASE_URL'),
                }
            }
        });
    }

}
