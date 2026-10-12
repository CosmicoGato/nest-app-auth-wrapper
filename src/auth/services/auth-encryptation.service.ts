import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthEncryptionService } from '../abstracts/auth-encryptation-service.abstract.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthEncryptationService implements AuthEncryptionService {

    hashPassword(password: string): string {
        const hashPassword = bcrypt.hashSync(password, 10);
        return hashPassword;
    }

    checkPassword(storedPassword: string, password: string): void {
        const checkPassword = bcrypt.compareSync(password, storedPassword);
        if (!checkPassword) throw new UnauthorizedException('Credentials are not valid');
    }
}
