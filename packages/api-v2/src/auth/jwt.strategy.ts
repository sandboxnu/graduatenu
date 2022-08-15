import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { Strategy } from "passport-jwt";
import { EnvironmentVariables } from "src/environment-variables";
import { Student } from "src/student/entities/student.entity";
import { formatServiceCtx } from "src/utils";
import { AuthService } from "./auth.service";
import { JwtPayload } from "./interfaces/jwt-payload";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger: Logger = new Logger();

  constructor(
    private readonly authService: AuthService,
    configService: ConfigService<EnvironmentVariables, true>
  ) {
    super({
      // Extract JWT from cookie in requests
      jwtFromRequest: (request: Request) => {
        const authCookie = request?.cookies?.auth_cookie;
        if (!authCookie) {
          this.logger.debug(
            { message: "Auth cookie missing" },
            JwtStrategy.formatJwtStrategyCtx("jwtFromRequest")
          );
        }
      },

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
      this.logger.debug(
        { message: "Invalid jwt payload", student },
        JwtStrategy.formatJwtStrategyCtx("validate")
      );
      throw new UnauthorizedException();
    }

    return student;
  }

  private static formatJwtStrategyCtx(method: string) {
    return formatServiceCtx(JwtStrategy.name, method);
  }
}
