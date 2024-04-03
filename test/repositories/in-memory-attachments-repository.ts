import { DomainEvents } from "@/core/events/domain-events";
import { StudentsRepository } from "@/domain/account/application/repositories/students-repository";
import { Student } from "@/domain/account/enterprise/entities/student";
import { AttachmentsRepository } from "@/domain/forum/application/repositories/attachments-repository";
import { Attachment } from "@/domain/forum/enterprise/entities/attachment";

export class InMemoryAttachmentsRepository implements AttachmentsRepository {
  public items: Attachment[] = [];

  async create(attachment: Attachment) {
    this.items.push(attachment);
  }
}
