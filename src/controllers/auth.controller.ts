import UserRepository from "@/repositories/user.repository";
import { Request, Response, NextFunction } from "express";
import { BaseController } from "../base";

class _AuthController extends BaseController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await UserRepository.find();
      console.log(data);
      this.success(req, res)({ user: "demo" });
    } catch (e) {
      next(this.getManagedError(e));
    }
  }
}

const AuthController = new _AuthController("AUTH_CONTROLLER");
export default AuthController;
