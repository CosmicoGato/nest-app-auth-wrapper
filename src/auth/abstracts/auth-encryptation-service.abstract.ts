export abstract class AuthEncryptionService {
    abstract hashPassword(password: string): string;
    abstract checkPassword(storedPassword: string, password: string): void;
}