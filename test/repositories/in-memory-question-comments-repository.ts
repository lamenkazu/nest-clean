import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { StudentsRepository } from "@/domain/account/application/repositories/students-repository";
import { QuestionCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";
import { InMemoryStudentRepository } from "./in-memory-students-repository";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/comment-with-author";

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  public items: QuestionComment[] = [];

  constructor(private studentsRepo: InMemoryStudentRepository) {}

  async findById(id: string) {
    const questionComment = this.items.find(
      (item) => item.id.toString() === id
    );

    if (!questionComment) return null;

    return questionComment;
  }

  async create(questionComment: QuestionComment) {
    this.items.push(questionComment);

    DomainEvents.dispatchEventsForAggregate(questionComment.id);
  }

  async delete(questionComment: QuestionComment) {
    const itemIndex = this.items.findIndex(
      (item) => item.id === questionComment.id
    );

    this.items.splice(itemIndex, 1);
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const MAX_ITEMS_PER_PAGE = 20;

    const questionComments = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * MAX_ITEMS_PER_PAGE, page * MAX_ITEMS_PER_PAGE);

    return questionComments;
  }

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    { page }: PaginationParams
  ) {
    const MAX_ITEMS_PER_PAGE = 20;

    const questionComments = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * MAX_ITEMS_PER_PAGE, page * MAX_ITEMS_PER_PAGE)
      .map((comment) => {
        const author = this.studentsRepo.items.find((student) =>
          student.id.equals(comment.authorId)
        );

        if (!author) {
          throw new Error(
            `Author with ID "${comment.authorId.toString()}" does not exists`
          );
        }

        return CommentWithAuthor.create({
          commentId: comment.id,
          content: comment.content,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          author: {
            id: comment.authorId,
            name: author?.name,
          },
        });
      });

    return questionComments;
  }
}
