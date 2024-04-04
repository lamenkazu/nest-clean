import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { QuestionPresenter } from "../presenters/question-presenter";
import { KnowQuestionBySlugService } from "@/domain/forum/application/services/know-question-by-slug";

import { FileInterceptor } from "@nestjs/platform-express";
import { UploadAndCreateAttachmentService } from "@/domain/forum/application/services/upload-and-create-attachment";
import { InvalidAttachmentType } from "@/domain/forum/application/services/errors/invalid-attachment-type";

@Controller("/attachments")
@UseInterceptors(FileInterceptor("file"))
export class UploadAttachmentController {
  constructor(
    private uploadAndCreateAttachment: UploadAndCreateAttachmentService
  ) {}

  @Post()
  async handle(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 2, // 2mb
          }),
          new FileTypeValidator({ fileType: ".(png|jpg|jpeg|pdf)" }),
        ],
      })
    )
    file: Express.Multer.File
  ) {
    const result = await this.uploadAndCreateAttachment.execute({
      fileName: file.originalname,
      fileType: file.mimetype,
      body: file.buffer,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case InvalidAttachmentType:
          throw new BadRequestException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { attachment } = result.value;
    return {
      attachmentId: attachment.id.toString(),
    };
  }
}
