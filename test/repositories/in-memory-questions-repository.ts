import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { AttachmentsRepository } from "@/domain/forum/application/repositories/attachments-repository";
import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { InMemoryStudentRepository } from "./in-memory-students-repository";
import { InMemoryAttachmentsRepository } from "./in-memory-attachments-repository";
import { InMemoryQuestionAttachmentsRepository } from "./in-memory-question-attachments-repository";
import { QuestionDetails } from "@/domain/forum/enterprise/entities/value-objects/question-details";

export class InMemoryQuestionRepository implements QuestionsRepository {
  public items: Question[] = [];

  constructor(
    private questionAttachsRepo: InMemoryQuestionAttachmentsRepository,
    private attachsRepo: InMemoryAttachmentsRepository,
    private studentsRepo: InMemoryStudentRepository
  ) {}

  async create(question: Question) {
    this.items.push(question);

    await this.questionAttachsRepo.createMany(question.attachments.getItems());

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async update(question: Question) {
    const itemIndex = this.items.findIndex((item) => item.id === question.id);

    this.items[itemIndex] = question;

    await this.questionAttachsRepo.createMany(
      question.attachments.getNewItems()
    );

    await this.questionAttachsRepo.deleteMany(
      question.attachments.getRemovedItems()
    );

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async delete(question: Question) {
    const itemIndex = this.items.findIndex((item) => item.id === question.id);

    this.items.splice(itemIndex, 1);

    this.questionAttachsRepo.deleteManyByQuestionId(question.id.toString());
  }

  async findById(id: string) {
    const question = this.items.find((item) => item.id.toString() === id);

    if (!question) return null;

    return question;
  }

  async findBySlug(slug: string) {
    const question = this.items.find((item) => item.slug.value === slug);

    if (!question) return null;

    return question;
  }

  async findDetailsBySlug(slug: string) {
    const question = this.items.find((item) => item.slug.value === slug);

    if (!question) return null;

    const author = this.studentsRepo.items.find((student) => {
      return student.id.equals(question.authorId);
    });

    if (!author) {
      throw new Error(
        `Author with ID "${question.authorId.toString()}" does not exists`
      );
    }

    const questionAttachs = this.questionAttachsRepo.items.filter(
      (questionAttach) => {
        return questionAttach.questionId.equals(question.id);
      }
    );

    const attachments = questionAttachs.map((questionAttach) => {
      const attachment = this.attachsRepo.items.find((attach) => {
        return attach.id.equals(questionAttach.attachmentId);
      });

      if (!attachment) {
        throw new Error(
          `Author with ID "${questionAttach.attachmentId.toString()}" does not exists`
        );
      }

      return attachment;
    });

    return QuestionDetails.create({
      questionId: question.id,
      author: {
        id: question.authorId,
        name: author.name,
      },
      title: question.title,
      slug: question.slug,
      content: question.content,
      bestAnswerId: question.bestAnswerId,
      attachments,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    });
  }

  async findManyRecent({ page }: PaginationParams) {
    const MAX_ITEMS_PER_PAGE = 20;

    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * MAX_ITEMS_PER_PAGE, page * MAX_ITEMS_PER_PAGE);

    return questions;
  }
}
