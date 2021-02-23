import talkToBob from "./talkToBob";

/*
Bob answers 'Sure.' if you ask him a question.

He answers 'Whoa, chill out!' if you yell at him.

He retorts 'Calm down, I know what I'm doing!' if you yell a question at him.

He says 'Fine. Be that way!' if you address him without actually saying anything.
He answers 'Whatever.' to anything else.
*/
it("answers 'Sure.' if you ask him a question", () => {
  expect(talkToBob("How are you?")).toBe("Sure.");
});

it("answers 'Whoa, chill out!' if you yell at him", () => {
  expect(talkToBob("Do it!")).toBe("Whoa, chill out!");
});

it("retorts 'Calm down, I know what I'm doing!' ", () => {
  expect(talkToBob("Bob ?!")).toBe("Calm down, I know what I'm doing!");
});

it("'Fine. Be that way!' if you address him without actually saying anything.' ", () => {
  expect(talkToBob("")).toBe("Fine. Be that way!");
});

it("answers whatever to anything else", () => {
  expect(talkToBob("asdasdasd")).toBe("Whatever.");
});
