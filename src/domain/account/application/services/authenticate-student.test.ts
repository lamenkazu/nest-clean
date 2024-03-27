import { InMemoryStudentRepository } from "test/repositories/in-memory-students-repository";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { AuthenticateStudentService } from "./authenticate-student";
import { makeStudent } from "test/factories/make-student";

let inMemoryStuentsRepo: InMemoryStudentRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
let sut: AuthenticateStudentService;

describe("Authenticate Student", () => {
  beforeEach(() => {
    inMemoryStuentsRepo = new InMemoryStudentRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();

    sut = new AuthenticateStudentService(
      inMemoryStuentsRepo,
      fakeHasher,
      fakeEncrypter
    );
  });

  it("should be able to authenticate a student", async () => {
    const student = makeStudent({
      email: "janedoe@mail.com",
      password: await fakeHasher.hash("123456"),
    });

    inMemoryStuentsRepo.create(student);

    const result = await sut.execute({
      email: "janedoe@mail.com",
      password: "123456",
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    });
  });
});
