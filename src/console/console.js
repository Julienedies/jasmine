/*
Copyright (c) 2008-2013 Pivotal Labs

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
var jasmineRequire = jasmineRequire || {};

jasmineRequire.console = function(j$) {
  j$.ConsoleReporter = jasmineRequire.ConsoleReporter();
};

if (typeof exports == "object") {
  exports.jasmineRequire = jasmineRequire;
}

jasmineRequire.ConsoleReporter = function() {
  function ConsoleReporter(options) {
    var print = options.print,
      showColors = options.showColors || false,
      onComplete = options.onComplete || function() {},
      now = options.now || function() { return new Date().getTime();},
      startTime = 0,
      specCount,
      failureCount,
      failedSpecs = [],
      pendingCount,
      ansi = {
        green: '\033[32m',
        red: '\033[31m',
        yellow: '\033[33m',
        none: '\033[0m'
      };

    this.jasmineStarted = function() {
      startTime = now();
      specCount = 0;
      failureCount = 0;
      pendingCount = 0;
      print("Started");
      printNewline();
    };

    this.jasmineDone = function() {
      var elapsed = now() - startTime;

      printNewline();
      for (var i = 0; i < failedSpecs.length; i++) {
        specFailureDetails(failedSpecs[i]);
      }

      printNewline();
      var specCounts = specCount + " " + plural("spec", specCount) + ", " +
        failureCount + " " + plural("failure", failureCount);

      if (pendingCount) {
        specCounts += ", " + pendingCount + " pending " + plural("spec", pendingCount);
      }

      print(specCounts);

      printNewline();
      var seconds = elapsed / 1000;
      print("Finished in " + seconds + " " + plural("second", seconds));

      printNewline();

      onComplete();
    };

    this.specDone = function(result) {
      specCount++;

      if (result.status == "pending") {
        pendingCount++;
        print(colored("yellow", "*"));
        return;
      }

      if (result.status == "passed") {
        print(colored("green", '.'));
        return;
      }

      if (result.status == "failed") {
        failureCount++;
        failedSpecs.push(result);
        print(colored("red", 'F'));
      }
    };

    return this;

    function printNewline() {
      print("\n");
    }

    function colored(color, str) {
      return showColors ? (ansi[color] + str + ansi.none) : str;
    }

    function plural(str, count) {
      return count == 1 ? str : str + "s";
    }

    function repeat(thing, times) {
      var arr = [];
      for (var i = 0; i < times; i++) {
        arr.push(thing);
      }
      return arr;
    }

    function indent(str, spaces) {
      var lines = (str || '').split("\n");
      var newArr = [];
      for (var i = 0; i < lines.length; i++) {
        newArr.push(repeat(" ", spaces).join("") + lines[i]);
      }
      return newArr.join("\n");
    }

    function specFailureDetails(result) {
      printNewline();
      print(result.fullName);

      for (var i = 0; i < result.failedExpectations.length; i++) {
        var failedExpectation = result.failedExpectations[i];
        printNewline();
        print(indent(failedExpectation.stack, 2));
      }

      printNewline();
    }
  }

  return ConsoleReporter;
};