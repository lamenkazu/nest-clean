export class Slug {
  public value: string;

  constructor(value: string) {
    this.value = value;
  }

  /**
   * Receives a string and normalize it as a slug
   *
   * Example: "An example title" =>  "an-example-title"
   *
   * @param text {string}
   */
  static createFromText(text: string) {
    const slugText = text
      .normalize("NFKD") //Remove todas as acentuações
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-") // s+ = white space - g = global (todos)
      .replace(/[^\w-]+/g, "") // \w = words - ^\w = Non Words
      .replace(/_/g, "-")
      .replace(/--+/g, "-")
      .replace(/-$/g, "");

    return new Slug(slugText);
  }
}
