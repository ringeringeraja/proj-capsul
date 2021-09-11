import { VercelRequest, VercelResponse } from "@vercel/node";

export const endpoint =
  (callback: any) =>
  async (req: VercelRequest, res: VercelResponse): Promise<any> => {
    try {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");

      res.setHeader(
        "Access-Control-Allow-Headers",
        "Accept,Accept-Version,Content-Length,Content-MD5,Content-Type,Date,X-Api-Version"
      );

      if (req.method === "OPTIONS") {
        res.status(200).end();
        return;
      }

      return await callback(req, res);
    } catch (err) {
      const { message } = err;
      console.trace(err);

      return res.status(500).send({ message, err });
    }
  };

export const configEndpoint = async (
  req: VercelRequest,
  res: VercelResponse
): Promise<void> => {
  try {
    (String.prototype as any).capitalize = function () {
      return this.charAt(0).toUpperCase() + this.slice(1);
    };

    const {
      query: { action },
    } = req;
    const [controller, verb] = (action as string).split("@");

    // eslint-disable-next-line
    const Controller = require(`./controllers/${(controller as any).capitalize()}Controller`).default;
    const instance = new Controller();

    if (!(verb in instance)) {
      throw "invalid verb";
    }

    const result = await instance[verb](req.body, res);
    res.status(200).send({ result });
  } catch (err) {
    console.trace(err);
    throw err;
  }
};
