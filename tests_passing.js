
/*
# At FundingCircle we hold most of our data on Kafka topics (think of these as big lists of messages). For performance reasons we try to keep each message under a certain size (currently 1MB). However, recently we've added a new data source that has a message size that breaks this limit. This means we need to implement some form of data compression.

# After a bit of googling we've come across something we think might work: Run length encoding. Your task is to implement the run-length encoding and decoding functions defined below.

# Some details about Run-length encoding:

# Run-length encoding (RLE) is a simple form of data compression, where runs (consecutive data elements) are replaced by just one data value and count.

# For example we can represent the original 53 characters with only 13.

# "WWWWWWWWWWWWBWWWWWWWWWWWWBBBWWWWWWWWWWWWWWWWWWWWWWWWB"  ->  "12WB12W3B24WB"

# RLE allows the original data to be perfectly reconstructed from the compressed data, which makes it a lossless data compression.

# "AABCCCDEEEE"  ->  "2AB3CD4E"  ->  "AABCCCDEEEE"

# For simplicity, you can assume that the unencoded string will only contain the letters A through Z (either lower or upper case) and whitespace. This way data to be encoded will never contain any numbers and numbers inside data to be decoded always represent the count for the following character.")
*/

const Mocha = require('mocha');
const assert = require('assert');
const mocha = new Mocha();

class RunLengthEncoding {
  static compress(str) {
    if (str === '') {
      return '';
    }
    
    const stringArray = str.split('');
    let counter = 0;
    
    const countedArray = stringArray.map((currentCharacter, index) => {
        counter++;
        if (currentCharacter !== stringArray[index+1]) {
          let currentCount = counter; // save the current counted set
          
          counter = 0; // reset the counter
          
          if(currentCount === 1) {
            return currentCharacter; // send back just one
          }
          return currentCount+currentCharacter; // send back compressed count
        }
    });
    
    return countedArray.join('');
  }
  
  
  
  static decompress(str) {
    if (str === '') {
      return '';
    }
    
    const matchingGroups = str.match(/[0-9]*[A-Za-z ]/g); // this should match any number and one character (incl. spaces) I chose a regex to break apart the string intuitively - thought process `whats great at matching groups`
    let decompressedString = ''; // create a strig to decode into, wouldn't be required if I used map next…
    
    matchingGroups.forEach((group) => { // could be a map again, then join the resulting array
      
      if (group.length > 1) {
        let character = group.substring(group.length-1); // cut off the end, we know the pattern and it should have the character we want to repeat
        let multiplier = parseInt(group.match(/\d/g).join(''), 10); // this one just gets the numbers - I could probably just use parseInt, but y'know javascript sometimes does weird things with letter and numbers
        let decodedGroup = ''; // store the decoded group

        for (let n = 0; n < multiplier; n++) { // run the decompression `multiplier` times
          decodedGroup += character; // decompress the group
        }
        decompressedString += decodedGroup; // stick the group on
      } else {
        decompressedString += group; // stick a single character on
      }
      
    });
    
    return decompressedString;
  }
}

mocha.suite.emit('pre-require', this, 'solution', mocha);

let rle = RunLengthEncoding;

describe('RunLengthEncoding', ()=> {
  it('returns empty string if input is empty', ()=> {
    assert.equal(rle.compress(''), '');
  });
  
  it('does not compress the input when it does not contain repeating characters', ()=> {
    assert.equal(rle.compress('XYZ'), 'XYZ');
  });
  
  it('correctly compresses the input string when all of its characters are repeating', ()=> {
    assert.equal(rle.compress('AABBBCCCC'), '2A3B4C');
  });
  
  it('correctly compresses the input when some of its characters are repeating', ()=> {
    assert.equal(rle.compress('WWWWWWWWWWWWBWWWWWWWWWWWWBBBWWWWWWWWWWWWWWWWWWWWWWWWB'), '12WB12W3B24WB');
  });
  
  it('correctly compresses the input when it contains lower case characters', ()=> {
    assert.equal(rle.compress('aabbbcccc'), '2a3b4c');
  });
  
  it('correctly compresses the input when it contains white spaces', ()=> {
    assert.equal(rle.compress('  hsqq qww  '), '2 hs2q q2w2 ');
  });
  
  it('does not decompress when the input is an empty string', ()=> {
    assert.equal(rle.decompress(''), '');
  });
  
  it('correctly decompresses the input when all of its characters are repeating', ()=> {
   assert.equal(rle.decompress('2A3B4C'), 'AABBBCCCC');
  }); 
  
 it('correctly decompresses the input when some of its characters are repeating', ()=> {
   assert.equal(rle.decompress('10WB12W3B24WB'), 'WWWWWWWWWWBWWWWWWWWWWWWBBBWWWWWWWWWWWWWWWWWWWWWWWWB');
  });
    
  it('correctly decompresses the input when it contains lower case characters', ()=> {
   assert.equal(rle.decompress('2a3b4c'), 'aabbbcccc');
  });
  
  it('correctly decompresses the input when it contains white spaces', ()=> {
   assert.equal(rle.decompress('2 hs2q q2w2 '), '  hsqq qww  ');
  });
  
  it('returns input when decompressing a compressed string', ()=> {
    let inp = 'zzz ZZ  zZ'
    let compressed = rle.compress(inp)
    
   assert.equal(rle.decompress(compressed), inp);
  });
})


mocha.run();
