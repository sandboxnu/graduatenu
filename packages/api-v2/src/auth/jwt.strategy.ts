import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { Strategy } from "passport-jwt";
import { EnvironmentVariables } from "src/environment-variables";
import { Student } from "src/student/entities/student.entity";
import { AuthService } from "./auth.service";
import { JwtPayload } from "./interfaces/jwt-payload";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    configService: ConfigService<EnvironmentVariables, true>
  ) {
    super({
      // Extract JWT from cookie in requests
      jwtFromRequest: (request: Request) =>
        request?.cookies?.auth_cookie ?? null,

      // Secret to decode the JWT(same one used to encode it)
      secretOrKey: configService.get("JWT_SECRET_KEY", { infer: true }),
    });
  }

  /**
   * Called once the JWT in the request is validated by the passport middlware.
   *
   * - Throws an error when the payload is invalid(uuid of the student doesn't exist)
   * - Else stores the return value(student) in the request object
   *
   * @param jwtPayload Decoded payload stored in the JWT
   */
  async validate(jwtPayload: JwtPayload): Promise<Student> {
    const student = await this.authService.validateJwtPayload(jwtPayload);

    if (!student) {
      throw new UnauthorizedException();
    }

    return student;
  }
}
