import { DomainEvents } from "@/core/events/domain-events";
import { StudentsRepository } from "@/domain/account/application/repositories/students-repository";
import { Student } from "@/domain/account/enterprise/entities/student";

export class InMemoryStudentRepository implements StudentsRepository {
  public items: Student[] = [];

  async create(student: Student) {
    this.items.push(student);

    DomainEvents.dispatchEventsForAggregate(student.id);
  }

  async findByEmail(email: string) {
    const student = this.items.find((item) => item.email === email);

    if (!student) return null;

    return student;
  }
}
