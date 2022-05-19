import {Module} from '@nestjs/common';
import {TasksModule} from './tasks/tasks.module';
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
    imports: [
        TasksModule,
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 49154,
            username: 'postgres',
            password: 'postgrespw',
            database: 'task-management',
            autoLoadEntities: true,
            synchronize: true,
        })],
})
export class AppModule {
}
