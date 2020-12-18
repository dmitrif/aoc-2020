// Dijkstra's Shunting Yard Algorithm
type ITermDefinition = {
  precedence: number,
  associativity: 'left' | 'right',
};

type ITermMap = {
  [termSymbol: string]: ITermDefinition,
};

export class Parser {
  options: ITermMap;

  constructor(options) {
    this.options = options;
  }

  parse = (input) => {
    var length = input.length,
    options = this.options,
    output = [],
    stack = [],
    index = 0;

    while (index < length) {
        var token = input[index++];

        switch (token) {
          case "(":
              stack.unshift(token);
              break;
          case ")":
              while (stack.length) {
                  var token = stack.shift();
                  if (token === "(") break;
                  else output.push(token);
              }

              if (token !== "(")
                  throw new Error("Mismatched parentheses.");
              break;
          default:
              if (options.hasOwnProperty(token)) {
                  while (stack.length) {
                      var punctuator = stack[0];

                      if (punctuator === "(") break;

                      var operator = options[token],
                          precedence = operator.precedence,
                          antecedence = options[punctuator].precedence;

                      if (precedence > antecedence ||
                          precedence === antecedence &&
                          operator.associativity === "right") break;
                      else output.push(stack.shift());
                  }

                  stack.unshift(token);
              } else output.push(token);
        }
    }

    while (stack.length) {
        var token = stack.shift();
        if (token !== "(") output.push(token);
        else throw new Error("Mismatched parentheses.");
    }

    return output;
  }
}