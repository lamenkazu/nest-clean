import { Slug } from "./slug";

test("it should be able to create a new slug from text", () => {
  const slug = Slug.createFromText("Exemplo de título da questão");

  expect(slug.value).toEqual("exemplo-de-titulo-da-questao");
});
