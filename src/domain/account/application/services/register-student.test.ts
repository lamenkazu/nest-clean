import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { InMemoryQuestionRepository } from "test/repositories/in-memory-questions-repository";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { RegisterStudentService } from "./register-student";
import { InMemoryStudentRepository } from "test/repositories/in-memory-students-repository";
import { FakeHasher } from "test/cryptography/fake-hasher";

let inMemoryStuentsRepo: InMemoryStudentRepository;
let fakeHasher: FakeHasher;
let sut: RegisterStudentService;

describe("Register Student", () => {
  beforeEach(() => {
    inMemoryStuentsRepo = new InMemoryStudentRepository();
    fakeHasher = new FakeHasher();

    sut = new RegisterStudentService(inMemoryStuentsRepo, fakeHasher);
  });

  it("should be able to register a new student", async () => {
    const result = await sut.execute({
      name: "jane doe",
      email: "janedoe@mail.com",
      password: "123456",
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual({
      student: inMemoryStuentsRepo.items[0],
    });
  });

  it("should hash student password upon registration", async () => {
    const result = await sut.execute({
      name: "jane doe",
      email: "janedoe@mail.com",
      password: "123456",
    });

    const hashedPassword = await fakeHasher.hash("123456");

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryStuentsRepo.items[0].password).toEqual(hashedPassword);
  });
});
