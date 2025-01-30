export class StringUtil {
  static capitalizeFirstLetter(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  static isEmpty(value: string | null | undefined): boolean {
    return !value || value.trim().length === 0;
  }
}
