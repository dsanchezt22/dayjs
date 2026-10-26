import MockDate from 'mockdate'
import moment from 'moment'
import dayjs from '../../src'
import isLeapYear from '../../src/plugin/isLeapYear'

dayjs.extend(isLeapYear)

beforeEach(() => {
  MockDate.set(new Date())
})

afterEach(() => {
  MockDate.reset()
})

it('IsLeapYear', () => {
  expect(dayjs('20000101').isLeapYear()).toBe(true)
  expect(dayjs('2100-01-01').isLeapYear()).toBe(false)
})

it('IsLeapYear edge cases', () => {
  ['2024-01-01', '2023-06-15', '1900-01-01', '2400-01-01', '2024-02-29', '2024-12-31'].forEach((d) => {
    expect(dayjs(d).isLeapYear()).toBe(moment(d).isLeapYear())
  })
  expect(dayjs('2024-01-01').isLeapYear()).toBe(true)
  expect(dayjs('2023-06-15').isLeapYear()).toBe(false)
  expect(dayjs('1900-01-01').isLeapYear()).toBe(false)
  expect(dayjs('2400-01-01').isLeapYear()).toBe(true)
})
