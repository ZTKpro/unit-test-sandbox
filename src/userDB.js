const axios = require("axios");
const reportError = require("./reportError");

class UserDB {
  constructor(users = []) {
    this.users = users;
  }

  get all() {
    return this.users;
  }

  get totalUsers() {
    return this.users.length;
  }

  findBy(attr, val) {
    return this.users.find((existingUser) => existingUser[attr] === val);
  }

  add(user) {
    if (!user.email) throw new Error("email needed");
    const duplicate = this.findBy("email", user.email);
    if (duplicate) throw new Error("email not unique");

    user.id = this.all.length + 1;
    this.users = [...this.users, user];

    return user;
  }

  edit(id, params) {
    const user = this.findBy("id", id);
    if (!user) throw new Error("User does not exists");
    let edited;

    this.users = this.users.map((temp) => {
      if (temp.id === id) {
        edited = { ...temp, ...params };
        return edited;
      } else {
        return temp;
      }
    });

    return edited;
  }

  random() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (this.totalUsers > 0) {
          const luckyNumber = Math.floor(Math.random() * this.totalUsers);
          resolve(this.users[luckyNumber]);
        } else {
          reject("No users...");
        }
      }, 300);
    });
  }

  async randomAvatar() {
    try {
      const response = await axios.get("https://randomuser.me/api/");

      return response.data.results[0].picture.thumbnail;
    } catch (err) {
      reportError(err);
      return "/temporaryAvatar.jpg";
    }
  }
}

module.exports = UserDB;
