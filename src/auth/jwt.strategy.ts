// // src/auth/jwt.strategy.ts
// import { Injectable } from '@nestjs/common'
// import { PassportStrategy } from '@nestjs/passport'
// // import { Strategy, ExtractJwt } from 'passport-jwt'
//
// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//     constructor() {
//         super({
//             jwtFromRequest: ExtractJwt.fromExtractors([
//                 req => req?.cookies?.jwt,                           // dari cookie
//                 ExtractJwt.fromAuthHeaderAsBearerToken(),          // fallback header
//             ]),
//             ignoreExpiration: false,
//             secretOrKey: process.env.JWT_SECRET,                  // dari .env
//         })
//     }
//
//     async validate(payload: any) {
//         return { userId: payload.sub, username: payload.username }
//     }
// }
