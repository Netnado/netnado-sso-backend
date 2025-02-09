export class DateTimeUtil {
    static convertDaysToMilliseconds(days: number): number {
        return days * 24 * 60 * 60 * 1000;
    }

    static generateDateFromNow(days: number, hours: number = 0, minutes: number = 0): Date {
        return new Date(
            Date.now() + DateTimeUtil.convertDaysToMilliseconds(days) + hours * 60 * 60 * 1000 + minutes * 60 * 1000,
        );
    }
}
