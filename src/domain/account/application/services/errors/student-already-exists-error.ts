import { ServiceError } from "@/core/errors/service-error";

export class StudentAlreadyExistsError extends Error implements ServiceError {
  constructor(identifier: string) {
    super(`Student "${identifier}" already exists.`);
  }
}
