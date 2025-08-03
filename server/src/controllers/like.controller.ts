import { Request, Response } from "express";
import { LikeService } from "../services/like.service";
import { HttpStatus } from "../constants/enums";
import { AuthRequest } from "../middlewares/auth.middleware";
import { ResponseHandler } from "../utils/response.handler";
import { Types } from "mongoose";

export class LikeController {
  private likeService: LikeService;

  constructor(likeService: LikeService = new LikeService()) {
    this.likeService = likeService;
  }

  async toggleLike(
    req: AuthRequest & { params: { id: string } },
    res: Response
  ): Promise<void> {
    const { id } = req.params;
    const response = await this.likeService.toggleLike(
      id,
      new Types.ObjectId(req.user!.id)
    );
    res.locals.response = response;
    res.status(response.status).json(response);
  }

  async getLikes(
    req: Request & { params: { id: string } },
    res: Response
  ): Promise<void> {
    const { id } = req.params;
    const response = await this.likeService.getLikes(id);
    res.locals.response = response;
    res.status(response.status).json(response);
  }
}
