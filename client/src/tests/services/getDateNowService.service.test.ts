import { describe, it, expect } from 'vitest';

// Services
import { getDateNowService } from '../../services/system/datetimeNow.service';

describe('getDateNowService', () => {
  it('should return a date', () => {
    // arrange
    const date = new Date();

    // act
    const result = getDateNowService();

    // assert
    expect(result).toBeInstanceOf(Date);
    expect(result).toEqual(date);
  });
});