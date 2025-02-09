export class StringUtil {
    static BCRYPT_PASSWORD_REGEX = /^\$2[aby]\$\d+\$/;
    static JWT_TOKEN_REGEX = /^[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+$/;

    static capitalizeFirstLetter(text: string): string {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    static isEmpty(value: string | null | undefined): boolean {
        return !value || value.trim().length === 0;
    }

    static matchPasswordRegex(password: string): boolean {
        return StringUtil.BCRYPT_PASSWORD_REGEX.test(password);
    }
}
