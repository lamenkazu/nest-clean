import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { InvalidAttachmentType } from "./errors/invalid-attachment-type";
import { Attachment } from "../../enterprise/entities/attachment";
import { AttachmentsRepository } from "../repositories/attachments-repository";
import { Uploader } from "../storage/uploader";

interface UploadAndCreateAttachmentServiceRequest {
  fileName: string;
  fileType: string;
  body: Buffer;
}

type UploadAndCreateAttachmentServiceResponse = Either<
  InvalidAttachmentType,
  {
    attachment: Attachment;
  }
>;

@Injectable()
export class UploadAndCreateAttachmentService {
  constructor(
    private attachmentsRepository: AttachmentsRepository,
    private uploader: Uploader
  ) {}

  async execute({
    fileName,
    fileType,
    body,
  }: UploadAndCreateAttachmentServiceRequest): Promise<UploadAndCreateAttachmentServiceResponse> {
    if (!/^(image\/(jpg|jpeg|png))|(application\/pdf)$/.test(fileType)) {
      return left(new InvalidAttachmentType(fileType));
    }

    const { url } = await this.uploader.upload({
      fileName,
      fileType,
      body,
    });

    const attachment = Attachment.create({
      title: fileName,
      url,
    });

    await this.attachmentsRepository.create(attachment);

    return right({
      attachment,
    });
  }
}