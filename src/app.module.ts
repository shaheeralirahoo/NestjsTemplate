import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from './auth/auth.module';
import { AtGuard } from './core/guards';
import { RolesGuard } from './core/guards/role.guard';
import { configStaticFiles, TypeOrmModuleRootAsync } from './core/config';
import { LoggerMiddleware } from './core/middleware/logger.middleware';
import { SharedModule } from './core/shared/shared.module';



@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MulterModule.register({
      dest: '../public',
    }),
   
    configStaticFiles,
    TypeOrmModuleRootAsync,
    AuthModule,
    SharedModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
