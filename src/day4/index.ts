import { test, readInput } from "../utils/index"

const HCL_MATCHER = /^#[a-z0-9]{6}$/;

const PID_MATCHER = /^[0-9]{9}$/;

const VALID_ECL = ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'];

const defaultValidator = () => true;

const requiredFields = {
  byr: { 
    name: 'Birth Year', 
    required: true, 
    validator: (val) => {
      const num = parseInt(val, 10);
      return val.length === 4 && num >= 1920 && num <= 2002;
    }
  },
  iyr: { 
    name: 'Issue Year', 
    required: true,
    validator: (val) => {
      const num = parseInt(val, 10);
      return val.length === 4 && num >= 2010 && num <= 2020;
    }
  },
  eyr: { 
    name: 'Expiration Year', 
    required: true,
    validator: (val) => {
      const num = parseInt(val, 10);
      return val.length === 4 && num >= 2020 && num <= 2030;
    }
  },
  hgt: { 
    name: 'Height', 
    required: true,
    validator: (val) => {
      const suffix = val.slice(-2);
      const num = parseInt(val, 10);

      if (suffix === 'cm') {
        return num >= 150 && num <= 193;
      }

      if (suffix === 'in') {
        return num >= 59 && num <= 76;
      }

      return false;
    }
  },
  hcl: { 
    name: 'Hair Color', 
    required: true,
    validator: (val) => HCL_MATCHER.test(val)
  },
  ecl: { 
    name: 'Eye Color', 
    required: true,
    validator: (val) => VALID_ECL.includes(val),
  },
  pid: { 
    name: 'Passport ID', 
    required: true,
    validator: (val) => PID_MATCHER.test(val),
  },
  cid: { 
    name: 'Country ID', 
    required: false,
  },
}

const prepareInput = (rawInput: string) => rawInput.split('\n\n').map(line => {
  const fields = line.split(/\s|\n/);
  return fields.reduce((result, field) => {
    const [key, val] = field.split(':');
    result[key] = val;
    return result;
  }, {});
})

const validatePassport = (withValidators, passport) => {
  const isValid = Object.keys(requiredFields).reduce((isValid, key) => {
    const fieldMetadata = requiredFields[key];
    const value = passport[key];
    const isDefined = typeof value !== 'undefined';
    const isMissingRequired = fieldMetadata.required && !isDefined;
    const passedValidation = isDefined ? (fieldMetadata.validator ?? defaultValidator)(value) : true;

    if (!isValid || isMissingRequired || (withValidators && !passedValidation)) {
      return false;
    }

    return true;
  }, true);

  return isValid;
}

const input = prepareInput(readInput())

const goA = (input) => {
  return input.map(validatePassport.bind(null, false)).filter(isValid => isValid).length;
}

const goB = (input) => {
  return input.map(validatePassport.bind(null, true)).filter(isValid => isValid).length;
}

/* Tests */

test(goA(prepareInput(`ecl:gry pid:860033327 eyr:2020 hcl:#fffffd
byr:1937 iyr:2017 cid:147 hgt:183cm

iyr:2013 ecl:amb cid:350 eyr:2023 pid:028048884
hcl:#cfa07d byr:1929

hcl:#ae17e1 iyr:2013
eyr:2024
ecl:brn pid:760753108 byr:1931
hgt:179cm

hcl:#cfa07d eyr:2025 pid:166559648
iyr:2011 ecl:brn hgt:59in`)), 2);

test(goB(prepareInput(`eyr:1972 cid:100
hcl:#18171d ecl:amb hgt:170 pid:186cm iyr:2018 byr:1926

iyr:2019
hcl:#602927 eyr:1967 hgt:170cm
ecl:grn pid:012533040 byr:1946

hcl:dab227 iyr:2012
ecl:brn hgt:182cm pid:021572410 eyr:2020 byr:1992 cid:277

hgt:59cm ecl:zzz
eyr:2038 hcl:74454a iyr:2023
pid:3556412378 byr:2007`)), 0);

test(goB(prepareInput(`pid:087499704 hgt:74in ecl:grn iyr:2012 eyr:2030 byr:1980
hcl:#623a2f

eyr:2029 ecl:blu cid:129 byr:1989
iyr:2014 pid:896056539 hcl:#a97842 hgt:165cm

hcl:#888785
hgt:164cm byr:2001 iyr:2015 cid:88
pid:545766238 ecl:hzl
eyr:2022

iyr:2010 hgt:158cm hcl:#b6652a ecl:blu byr:1944 eyr:2021 pid:093154719`)), 4);

/* Results */

console.time("TimeA")
const resultA = goA(input)
console.timeEnd("TimeA")
console.time("TimeB")
const resultB = goB(input)
console.timeEnd("TimeB")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
