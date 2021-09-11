import { Controller } from "./Controller";
import { UserInterface, User } from "../models/User";
import VideoController from "./VideoController";

export interface GetVideoInterface {
  login: string;
}

export interface UpdateVideoInterface {
  login: string;
  videoId: string;
  status: string;
  mark: number;
}

export default class UserController extends Controller<UserInterface> {
  constructor() {
    super({
      model: User,
      description: "usuário",
    });
  }

  async getVideo(body: GetVideoInterface): Promise<any> {
    if (!body?.login) throw "login expected";

    await this.save({
      find: { login: body.login },
      modify: { $inc: { viewed: 1 } },
    });

    const controller = new VideoController();
    return controller.get({});
  }

  /*
   * talvez fosse possível economizar transações nesse endpoint
   * mesclando as duas últimas
   */
  async updateVideo(body: UpdateVideoInterface): Promise<any> {
    const controller = new VideoController();
    const video = await controller.get({ id: body.videoId });

    if (!video) throw `unexistent video ${body.videoId}`;

    await this.save(
      {
        find: {
          login: body.login,
          viewedVideos: { $not: { $elemMatch: { video: video._id } } },
        },
        modify: {
          $push: {
            viewedVideos: {
              video: video._id,
            },
          },
        },
      },
      {}
    );

    return this.save(
      {
        find: { login: body.login },
        modify: {
          $set: {
            "viewedVideos.$[el].status": body.status,
            "viewedVideos.$[el].mark": body.mark,
          },
        },
      },
      {
        arrayFilters: [{ "el.video": video._id }],
        new: true,
      }
    );
  }
}
