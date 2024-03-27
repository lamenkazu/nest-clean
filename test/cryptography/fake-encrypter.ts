import { Encrypter } from "@/domain/account/application/cryptography/encrypter";

export class FakenEncrypter implements Encrypter {
  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return JSON.stringify(payload);
  }
}
