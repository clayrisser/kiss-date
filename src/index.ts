export default class KissDate {
  public dateArr: DateArr;

  constructor(
    date?: Date | KissDate | DateArr | UnixTimestamp,
    timezone?: Timezone | string
  ) {
    const kissDateTimezone =
      typeof timezone === 'string'
        ? KissDate.getTimezone(timezone)
        : timezone ?? null;
    if (typeof date === 'number') {
      this.dateArr = [
        date,
        kissDateTimezone ?? -new Date().getTimezoneOffset() * Time.Minute
      ];
    } else if (Array.isArray(date)) {
      this.dateArr = [date[0], kissDateTimezone ?? date[1]];
    } else if (date instanceof Date) {
      this.dateArr = [
        Math.floor(date.getTime() * Time.Millisecond),
        kissDateTimezone ?? -date.getTimezoneOffset() * Time.Minute
      ];
    } else if (date instanceof KissDate) {
      this.dateArr = date.dateArr;
    } else {
      const jsDate = new Date();
      this.dateArr = [
        Math.floor(jsDate.getTime() * Time.Millisecond),
        kissDateTimezone ?? -jsDate.getTimezoneOffset() * Time.Minute
      ];
    }
  }

  get jsDate(): Date {
    return new Date(this.dateArr[0] / Time.Millisecond);
  }

  get localShiftedJsDate(): Date {
    return new Date((this.dateArr[0] + this.timezone) / Time.Millisecond);
  }

  changeTimezone(timezone: Timezone | string, adjustTime = true): KissDate {
    const kissDateTimezone =
      typeof timezone === 'string'
        ? KissDate.getTimezone(timezone)
        : timezone ?? null;
    this.dateArr[1] = kissDateTimezone;
    if (!adjustTime) this.dateArr[0] += kissDateTimezone;
    return this;
  }

  get timezone(): Timezone {
    return this.dateArr[1];
  }

  get timezoneStr(): string {
    const timezoneAbs = Math.abs(this.timezone);
    const hours = Math.floor(timezoneAbs / Time.Hour);
    const minutes = Math.floor((timezoneAbs / Time.Minute) % Time.Minute);
    return `${this.timezone < 0 ? '-' : '+'}${hours
      .toString()
      .padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  static getTimezone(timezone: string | number): number {
    if (typeof timezone === 'number') return timezone;
    const timezoneArr = timezone.split(':');
    let timezoneStr =
      timezoneArr.length > 1 ? timezoneArr[0] + timezoneArr[1] : timezoneArr[0];
    if (timezoneStr.length < 5) timezoneStr = `+${timezoneStr}`;
    if (
      (timezoneStr[0] !== '+' && timezoneStr[0] !== '-') ||
      timezoneStr.length < 5
    ) {
      throw new Error(`${timezone} is an invalid timezone string`);
    }
    const sign = timezoneStr[0] === '-' ? -1 : 1;
    const hours = parseInt(timezoneStr.substr(1, 2), 10) * Time.Minute;
    const minutes = parseInt(timezoneStr.substr(3, 2), 10) * Time.Minute;
    return (hours * Time.Minute + minutes) * sign;
  }
}

export enum Time {
  Second = 1,
  Minute = Time.Second * 60,
  Hour = Time.Minute * 60,
  Day = Time.Hour * 24,
  Millisecond = 1 / 1000
}

export type DateArr = [UnixTimestamp, Timezone];

export type UnixTimestamp = number;

export type Timezone = number;
