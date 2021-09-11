import { SaveInterface, Controller } from "./Controller";
import { VideoInterface, Video } from "../models/Video";

export default class VideoController extends Controller<VideoInterface> {
  constructor() {
    super({
      model: Video,
      description: "vídeo",
    });
  }

  async save(body: SaveInterface): Promise<any> {
    return super.save({
      find: { campaign: 'default' },
      modify: body
    })
  }
}
