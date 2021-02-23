const UserDB = require("./userDB.js");
const axios = require("axios");
const validAvatar = require("./__mocks__/validAvatar.json");
const invalidAvatar = require("./__mocks__/invalidAvatar.json");
const jest = require("jest");

jest.mock("axios");
jest.mock("./reportError");

describe("totalUsers", () => {
  it("returns zero when no users", () => {
    const subject = new UserDB();
    expect(subject.totalUsers).toBe(0);
  });

  it("returns count of users", () => {
    const subject = new UserDB([
      { email: "Artur@google.com" },
      { email: "Tester@google.com" }
    ]);

    expect(subject.totalUsers).toBe(2);
  });
});

describe("add", () => {
  it("adds user", () => {
    const subject = new UserDB();
    const initialCount = subject.totalUsers;

    subject.add({ email: "tester@gmail.com" });

    expect(subject.totalUsers).toBeGreaterThan(initialCount);
  });

  it("throws error when no email given", () => {
    const subject = new UserDB();

    expect(() => {
      subject.add({ emails: "tester@gmail.com" });
    }).toThrow("email needed");
  });

  it("throws error when email duplicated", () => {
    const subject = new UserDB();
    subject.add({ email: "tester@gmail.com" });

    expect(() => {
      subject.add({ email: "tester@gmail.com" });
    }).toThrow("email not unique");
  });
});

describe("random", () => {
  it("rejects when no users", async () => {
    const subject = new UserDB();

    try {
      await subject.random();
    } catch (err) {
      expect(err).toEqual("No users...");
    }
  });

  it("returns random user", async () => {
    const subject = new UserDB();
    const luckyEmails = [
      "lucky0@gmail.com",
      "lucky1@gmail.com",
      "lucky2@gmail.com"
    ];

    luckyEmails.forEach((email) => subject.add({ email }));

    const luckyGuy = await subject.random();
    expect(luckyEmails).toContain(luckyGuy.email);
  });
});

describe("randomAvatar returns", () => {
  it("avatar from 3rd party service", async () => {
    axios.get.mockImplementationOnce(() => {
      return Promise.resolve({ data: validAvatar });
    });
    const subject = new UserDB();

    const avatar = await subject.randomAvatar();
    expect(avatar).toBe("https://randomuser.me/api/portraits/thumb/men/82.jpg");
  });

  it("temp avatar when service not responding", async () => {
    axios.get.mockImplementationOnce(() => {
      return Promise.reject({ data: "some error..." });
    });
    const subject = new UserDB();

    const avatar = await subject.randomAvatar();
    expect(avatar).toBe("/temporaryAvatar.jpg");
  });

  it("temp avatar when 3rd party payload is wrong", async () => {
    axios.get.mockImplementationOnce(() => {
      return Promise.resolve({ data: invalidAvatar });
    });
    const subject = new UserDB();

    const avatar = await subject.randomAvatar();
    expect(avatar).toBe("/temporaryAvatar.jpg");
  });
});
