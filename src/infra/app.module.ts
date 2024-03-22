import { ConfigModule } from "@nestjs/config";
import { envSchema } from "./env";

import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { HttpModule } from "./http/http.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true, // Para não configurar em todos os módulos da aplicação.
    }),
    AuthModule,
    HttpModule,
  ],
})
export class AppModule {}
