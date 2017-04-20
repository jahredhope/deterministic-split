const deterministicSplit = require('./index.js')
const oneHundredStrings = require('./oneHundredStrings')
const tenThousandStrings = require('./tenThousandStrings')

describe('deterministic-split', () => {
  describe('README', () => {
    it('should give aValue 1', () => {
      expect(deterministicSplit('a value', 2)).toEqual(0)
    })

    it('should give bValue 1', () => {
      expect(deterministicSplit('b value', 2)).toEqual(1)
    })

    it('should give aValue 1 with 4 buckets', () => {
      expect(deterministicSplit('a value', 5)).toEqual(3)
    })
  })

  it('is a function', () => {
    expect(typeof deterministicSplit).toBe('function')
  })

  it('should require a value', () => {
    expect(() => deterministicSplit(null)).toThrow(new TypeError('A value is required'))
  })

  it('should require a list of options or a number', () => {
    expect(() => deterministicSplit('testValue', undefined)).toThrow(new TypeError('A list of options or number of options is required'))
  })

  it('should allow value to be a number', () => {
    expect(() => deterministicSplit(10, 1)).not.toThrow(TypeError)
  })

  it('should return a test bucket index if not given a value', () => {
    const result = deterministicSplit('testValue', 1)
    expect(result).toBe(0)
  })

  it('should return a test bucket value', () => {
    const result = deterministicSplit('testValue', ['testExperienceA'])
    expect(result).toBe('testExperienceA')
  })

  it('should be put in correct bucket', () => {
    const values = ['a','fred', 'james', 'jordan@jordonia.com', 2, 4, 5, 1, 'read', 'asdasdsafsfasfsad', 'asdfdafadsfadsfdasfdsfasdfdsf', 'asddasf']
    const result = values.map(value => deterministicSplit(value, ['testExperienceA', 'testExperienceB']))
    const expectedResult = ['testExperienceB', 'testExperienceB', 'testExperienceB', 'testExperienceB', 'testExperienceB', 'testExperienceB', 'testExperienceB', 'testExperienceA', 'testExperienceB', 'testExperienceB', 'testExperienceB', 'testExperienceA']
    expect(result).toEqual(expectedResult)
  })

  it('should give an even split', () => {
    const errorAllowance = 0.95
    const experienceCount = 2
    const testCases = tenThousandStrings
    let counts = {}
    testCases
      .map(value => deterministicSplit(value, experienceCount))
      .forEach(result => counts[result] = counts[result] + 1 || 1)
    Object.keys(counts).forEach((key) => {
      expect(counts[key]).toBeGreaterThan((testCases.length / experienceCount) * errorAllowance)
    })
  })

  it('should give an even split when given numbers', () => {
    const errorAllowance = 0.98
    const experienceCount = 3
    const testCases = Array.from(new Array(10000)).map((val, index) => index )
    let counts = {}
    testCases
      .map(value => deterministicSplit(value, experienceCount))
      .forEach(result => counts[result] = counts[result] + 1 || 1)
    Object.keys(counts).forEach((key) => {
      expect(counts[key]).toBeGreaterThan((testCases.length / experienceCount) * errorAllowance)
    })
  })

  it('should give an evenish split for a small number of values', () => {
    const errorAllowance = 0.85
    const experienceCount = 2
    const testCases = oneHundredStrings
    let counts = {}
    testCases
      .map(value => deterministicSplit(value, experienceCount))
      .forEach(result => counts[result] = counts[result] + 1 || 1)
    Object.keys(counts).forEach((key) => {
      expect(counts[key]).toBeGreaterThan((testCases.length / experienceCount) * errorAllowance)
    })
  })

  it('should give a even split for multiple buckets', () => {
    const errorAllowance = 0.90
    const experienceCount = 7
    const testCases = tenThousandStrings
    let counts = {}
    testCases
      .map(value => deterministicSplit(value, experienceCount))
      .forEach(result => counts[result] = counts[result] + 1 || 1)
    Object.keys(counts).forEach((key) => {
      expect(counts[key]).toBeGreaterThan((testCases.length / experienceCount) * errorAllowance)
    })
  })

  it('should pass back a function if given', () => {
    const testFunction = () => {}
    const anotherTestFunction = () => {}
    const result = deterministicSplit('testValue', [{value: testFunction}, {value: anotherTestFunction}])
    expect(result).toBe(testFunction)
  })

  it('should give a different result if added suffic', () => {
    const resultOne = deterministicSplit('testValue' + 'something', 5)
    const resultTwo = deterministicSplit('testValue' + 'other', 5)
    expect(resultOne).not.toEqual(resultTwo)
  })

  it('should give a the same result for the same value', () => {
    const resultOne = deterministicSplit('testValue', 5)
    const resultTwo = deterministicSplit('testValue', 5)
    expect(resultOne).toEqual(resultTwo)
  })
})
