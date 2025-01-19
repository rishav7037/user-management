import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigsService } from '../configs/configs.service';
import { AuthService } from './../../auth/auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigsService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('jwtSecret'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(this);
    if (await this.authService.isTokenBlacklisted(token)) {
      throw new UnauthorizedException('Token has been revoked');
    }

    return { username: payload.username, roles: payload.roles };
  }
}
