import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { UtilsModule } from './utils/utils.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './users/users.entity';
import { AuthorizationMiddleware } from './authorization.middleware';
import { AuthService } from './Autentication/auth.service';
import { MailModule } from './mail/mail.module';
import { LabelsModule } from './utils/labels.module';
import { UploadModule } from './upload/upload.module';
import { UploadEntity } from './upload/upload.entity';
import { FilesModule } from './files/files.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ShopsModule } from './shops/shops.module';
import { TablesModule } from './tables/tables.module';
import { StatsTablesModule } from './stats_tables/stats_tables.module';
import { GamesModule } from './games/games.module';
import { ReserveModule } from './reserve/reserve.module';
import { AditionalInfoModule } from './aditional_info/aditional_info.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    UtilsModule,
    MailModule,
    LabelsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UploadModule,
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: 'database',
        port: +configService.get('MYSQL_PORT') || 3306,
        username: configService.get('MYSQL_USER'),
        password: configService.get('MYSQL_PASSWORD'),
        database: configService.get('MYSQL_DATABASE'),
        entities: [User, UploadEntity],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    LabelsModule,
    FilesModule,
    ShopsModule,
    TablesModule,
    StatsTablesModule,
    GamesModule,
    ReserveModule,
    AditionalInfoModule,
  ],
  controllers: [],
  providers: [AuthorizationMiddleware, AuthService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthorizationMiddleware)
      .exclude({ path: 'users/login', method: RequestMethod.POST })
      .forRoutes('*');
  }
}
