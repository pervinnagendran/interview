import { TimeIntervalPipe } from './time-interval.pipe';

describe('TimeIntervalPipe', () => {
  const pipe = new TimeIntervalPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return 00:00 for invalid time', () => {
    expect(pipe.transform(0)).toEqual('00:00');
  });

  it('should return the time in mm:ss format', () => {
    expect(pipe.transform(59)).toEqual('00:59');
    expect(pipe.transform(75)).toEqual('01:15');
  });

});
