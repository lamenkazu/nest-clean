import { ConfigModule } from "@nestjs/config";
import { envSchema } from "./env/env";

import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { HttpModule } from "./http/http.module";
import { EnvModule } from "./env/env.module";
import { EventsModule } from "./events/events.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true, // Para não configurar em todos os módulos da aplicação.
    }),
    AuthModule,
    HttpModule,
    EnvModule,
    EventsModule,
  ],
})
export class AppModule {}
