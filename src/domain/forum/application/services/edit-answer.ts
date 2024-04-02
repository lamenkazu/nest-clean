import { Either, left, right } from "@/core/either";
import { Answer } from "../../enterprise/entities/answer";
import { AnswerRepository } from "../repositories/answers-repository";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { AnswerAttachmentList } from "../../enterprise/entities/answer-attachment-list";
import { AnswerAttachment } from "../../enterprise/entities/answer-attachment";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { AnswerAttachmentsRepository } from "../repositories/answer-attachments-repository";
import { Injectable } from "@nestjs/common";

interface EditAnswerServiceRequest {
  authorId: string;
  answerId: string;
  content: string;
  attachmentsIds: string[];
}

type EditAnswerServiceResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    answer: Answer;
  }
>;

@Injectable()
export class EditAnswerService {
  constructor(
    private answerRepo: AnswerRepository,
    private answerAttachsRepo: AnswerAttachmentsRepository
  ) {}

  async execute({
    authorId,
    answerId,
    content,
    attachmentsIds,
  }: EditAnswerServiceRequest): Promise<EditAnswerServiceResponse> {
    const answer = await this.answerRepo.findById(answerId);

    if (!answer) return left(new ResourceNotFoundError());

    if (authorId !== answer.authorId.toString())
      return left(new NotAllowedError());

    const currentAnswerAttachments =
      await this.answerAttachsRepo.findManyByAnswerId(answerId);

    const answerAttachmentList = new AnswerAttachmentList(
      currentAnswerAttachments
    );

    const updatedAnswerAttachments = attachmentsIds.map((id) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityId(id),
        answerId: answer.id,
      });
    });

    answerAttachmentList.update(updatedAnswerAttachments);

    answer.attachments = answerAttachmentList;

    answer.content = content;

    await this.answerRepo.update(answer);

    return right({
      answer,
    });
  }
}
