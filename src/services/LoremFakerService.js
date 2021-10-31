const axios = require("axios");
const createHttpError = require("http-errors");

class LoremFakerService {
  static async getTitles(requestNumber) {
    try {
      return axios.get(
        `https://lorem-faker.vercel.app/api?quantity=${requestNumber}`
      );
    } catch (error) {
      throw createHttpError.ServiceUnavailable(error);
    }
  }
}

module.exports = LoremFakerService;
