import { Controller } from "./Controller";
import { UserInterface, User } from "../models/User";
import VideoController from "./VideoController";

export interface StartInterface {
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

  /*
   * talvez fosse possível economizar transações nesse endpoint
   * mesclando as duas últimas
   */
  async updateVideo(body: StartInterface): Promise<any> {
    const controller = new VideoController();
    const video = await controller.get({ id: body.videoId });

    if (!video) throw `unexistent video ${body.videoId}`;

    await this.save({
      find: { login: body.login },
      modify: {
        $addToSet: {
          viewedVideos: {
            video: video._id,
          },
        },
      },
    });

    return this.save({
      find: { login: body.login, viewedVideos: { video: video._id } },
      modify: {
        $set: {
          "viewedVideos.$.status": body.status,
          "viewedVideos.$.mark": body.mark,
        },
      },
    });
  }
}
