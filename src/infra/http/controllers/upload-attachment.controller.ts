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

@Controller("/attachments")
@UseInterceptors(FileInterceptor("file"))
export class UploadAttachmentController {
  //   constructor() {}

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
    console.log(file);
  }
}
