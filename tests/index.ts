import KissDate, { Time } from '~/index';

describe('new KissDate(new Date())', () => {
  it('should create date from javascript date', async () => {
    const date = new Date();
    const kissDate = new KissDate(date);
    expect(kissDate).toMatchObject({
      dateArr: [
        Math.floor(date.getTime() * Time.Millisecond),
        -date.getTimezoneOffset() * Time.Minute
      ]
    });
  });
});

describe("KissDate.getTimezone('-06:00')", () => {
  it('should create a timezone from a string', async () => {
    expect(KissDate.getTimezone('-06:00')).toBe(-(6 * Time.Hour));
  });
});

describe('new KissDate().timezoneStr', () => {
  it('should create a timezone from a string', async () => {
    const kissDate = new KissDate(new Date(), 6 * Time.Hour);
    expect(kissDate.timezoneStr).toBe('+06:00');
  });
});

export default null;
