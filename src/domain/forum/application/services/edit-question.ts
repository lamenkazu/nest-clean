import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";

import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Question } from "../../enterprise/entities/question";
import { QuestionAttachment } from "../../enterprise/entities/question-attachment";

import { QuestionsRepository } from "../repositories/questions-repository";
import { QuestionAttachmentsRepository } from "../repositories/question-attachments-repository";

import { QuestionAttachmentList } from "../../enterprise/entities/question-attachment-list";

interface EditQuestionServiceRequest {
  authorId: string;
  questionId: string;
  title: string;
  content: string;
  attachmentsIds: string[];
}

type EditQuestionServiceResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question;
  }
>;

export class EditQuestionService {
  constructor(
    private questionRepo: QuestionsRepository,
    private questionAttachsRepo: QuestionAttachmentsRepository
  ) {}

  async execute({
    authorId,
    questionId,
    title,
    content,
    attachmentsIds,
  }: EditQuestionServiceRequest): Promise<EditQuestionServiceResponse> {
    const question = await this.questionRepo.findById(questionId);

    if (!question) return left(new ResourceNotFoundError());

    if (authorId !== question.authorId.toString())
      return left(new NotAllowedError());

    const currentQuestionAttachments =
      await this.questionAttachsRepo.findManyByQuestionId(questionId);

    const questionAttachmentList = new QuestionAttachmentList(
      currentQuestionAttachments
    );

    const updatedQuestionAttachments = attachmentsIds.map((id) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityId(id),
        questionId: question.id,
      });
    });

    questionAttachmentList.update(updatedQuestionAttachments);

    question.attachments = questionAttachmentList;
    question.title = title;
    question.content = content;

    await this.questionRepo.update(question);

    return right({
      question,
    });
  }
}
