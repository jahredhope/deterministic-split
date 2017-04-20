const md5 = require('md5')

module.exports = (value, buckets) => {
  if(value === undefined || value === null || !value.toString) {
    throw new TypeError('A value is required')
  }
  if(!buckets) {
    throw new TypeError('A list of options or number of options is required')
  }

  if(typeof buckets === 'number') {
    buckets = Array.from(new Array(buckets)).map((val, index) => ({value: index, weight: 1}))
  }

  buckets = buckets.map((bucket, index) => {
    if(typeof bucket === 'string') {
      return {
        value: bucket,
        weight: 1
      }
    }
    if(typeof bucket === 'number') {
      if (bucket % 1) {
        throw new TypeError('Weights must be integers')
      }
      return {
        value: index,
        weight: bucket
      }
    }
    if(typeof bucket === 'object') {
      if ((bucket.weight || 0) % 1) {
        throw new TypeError('Weights must be integers')
      }
      return {
        value: bucket.value || index,
        weight: bucket.weight || 1
      }
    }
    throw new Error(`Unable to understand passed in buckets of type ${typeof buckets}`)
  })
  const totalWeight = buckets.reduce((count, bucket) => bucket.weight + count, 0)

  const hash = md5(value.toString()).substr(0,8)
  const hashAsInt = parseInt("0x" + hash, 16)

  const bucketNumber = hashAsInt % totalWeight

  let accumulated = 0
  return buckets.find((bucket) => {
    accumulated += bucket.weight
    return accumulated > bucketNumber
  }).value
}
