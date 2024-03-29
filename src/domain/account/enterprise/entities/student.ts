import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

export interface StudentProps {
  name: string;
  email: string;
  password: string;
}

export class Student extends Entity<StudentProps> {
  static create(props: StudentProps, id?: UniqueEntityId) {
    const student = new Student(props, id);

    return student;
  }

  public get name(): string {
    return this.props.name;
  }
  public get email(): string {
    return this.props.email;
  }
  public get password(): string {
    return this.props.password;
  }
}
