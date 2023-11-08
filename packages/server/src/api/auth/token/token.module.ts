import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenStore } from './entities/token-store.entity';
import { TokenService } from './token.service';

@Module({
  imports: [JwtModule.register({}), TypeOrmModule.forFeature([TokenStore])],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
