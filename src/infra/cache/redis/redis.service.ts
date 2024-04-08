import { EnvService } from "@/infra/env/env.service";
import { OnModuleDestroy } from "@nestjs/common";
import { Redis } from "ioredis";
import { Injectable } from "@nestjs/common";

@Injectable()
export class RedisService extends Redis implements OnModuleDestroy {
  constructor(private envService: EnvService) {
    super({
      host: envService.get("REDIS_HOST"), //localhost
      port: envService.get("REDIS_PORT"),
      db: envService.get("REDIS_DB"),
    });
  }

  onModuleDestroy() {
    return this.disconnect();
  }
}
