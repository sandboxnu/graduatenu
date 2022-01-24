import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EnvironmentVariables } from 'src/environment-variables';
import { Student } from 'src/student/entities/student.entity';
import { AuthService } from './auth.service';
import { JwtPayload } from './interfaces/jwt-payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    configService: ConfigService<EnvironmentVariables, true>,
  ) {
    super({
      // Extract JWT from the Auth header in the request as a bearer token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // Secret to decode the JWT(same one used to encode it)
      secretOrKey: configService.get('JWT_SECRET_KEY', { infer: true }),
    });
  }

  /**
   * Called once the JWT in the request is validated by the passport middlware.
   * - Throws an error when the payload is invalid(uuid of the student doesn't exist)
   * - Else stores the return value(student) in the request object
   * @param jwtPayload decoded payload stored in the JWT
   */
  async validate(jwtPayload: JwtPayload): Promise<Student> {
    try {
      return await this.authService.validateJwtPayload(jwtPayload);
    } catch (_error) {
      throw new UnauthorizedException('Invalid JWT');
    }
  }
}
