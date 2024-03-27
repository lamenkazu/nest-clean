import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

interface InstructorProps {
  name: string;
}

export class Instructor extends Entity<InstructorProps> {
  static create(props: InstructorProps, id?: UniqueEntityId) {
    const instructor = new Instructor(props, id);

    return instructor;
  }

  /**
   * Getter $name
   * @return {string}
   */
  public get name(): string {
    return this.name;
  }

  /**
   * Setter $name
   * @param {string} value
   */
  public set name(value: string) {
    this.name = value;
  }
}
