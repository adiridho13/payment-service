// import { Injectable, UnauthorizedException } from '@nestjs/common';
// // import { JwtService } from '@nestjs/jwt';
// import { UsersService } from '../users/users.service';
//
// @Injectable()
// export class AuthService {
//     constructor(
//         private usersService: UsersService,
//         private jwtService: JwtService,
//     ) {}
//
//     // validasi username/password, bisa ganti sesuai kebutuhan (DB, LDAP, dsb)
//     async validateUser(username: string, pass: string) {
//         const user = await this.usersService.findByUsername(username);
//         if (user && user.password === pass) {
//             // jangan return password
//             const { password, ...result } = user;
//             return result;
//         }
//         return null;
//     }
//
//     async login(user: any) {
//         const payload = { sub: user.id, username: user.username, role: user.role };
//         return {
//             access_token: this.jwtService.sign(payload),
//             expires_in: this.jwtService.decode(this.jwtService.sign(payload))['exp'],
//         };
//     }
// }
