# deterministic-split

Deterministically choose between a number of options given a certain value.  

Ideal for A|B Testing.  

When given a value, and any number of options will choose an option with equal probability of each option being chosen.  
Will always return the same option for any given value and number of options.  

```
const deterministicSplit = require('deterministic-split');

deterministicSplit('a value', 2) // Always returns 0
deterministicSplit('b value', 2) // Always returns 1
deterministicSplit('a value', 5) // Always returns 3
```

### Use
deterministicSplit(value: string, options: array|number)  
Array can include:  
- number: the weight of that option  
- string: the value to return when returning that option  
- object: an option containing a weight and a value to return  

### Example Use-case
I have many users, and many options to present the user.  
I want to present the user only one option.
I always want to present the same user the same option.  
I'm unable to store which user has been presented which option.  
```
deterministicSplit('fred', 3) // Fred always gets the second option
```
OR
```
deterministicSplit('fred', ['orange', 'yellow', 'red']) // Fred always gets 'yellow'
```

I want most users to see the normal color 'orange', and only a few to get the other two
```
// Most users will get 'yellow', as will fred
deterministicSplit('fred', [ 3, 1, 1 ])
deterministicSplit('fred', [{value: 'orange', weight: 3}, {value: 'yellow', weight: 1}, {value: 'red', weight: 1}])
```

But poor fred is often finding himself put in the same group of people.  
I want to get a unique split for any given test.  
To do this I can add a salt to my value.  
```
deterministicSplit('fred' + 'whatColor', [ 'orange', 'yellow', 'red' ]) // Fred always gets orange
deterministicSplit('fred' + 'whatSize', [ 'big', 'medium', 'small' ]) // Fred always gets medium
```

Another situation might require passing a value that is not a string. In this case it must be nested inside an object.  


I want to run different code depending on what option is chosen  
```
deterministicSplit('fred' + 'whatFunction', [{
  value: () => console.log('Run Code A')
},{
  value: () => console.log('Run Code B')
} ]) // Returns the first function
```
