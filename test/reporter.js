import chalk from 'chalk';
import ora from 'ora';

export default class CustomReporter {
  spinner = ora();
  allPassed = true;
  index = 1;

  onRunStart() {
    console.log('\n');
    this.spinner.start();
    console.log(chalk.black.bold('Running Tests...'));
  }

  onTestResult(a, b) {
    // console.log(this.index === 9 && b);
    this.spinner.stop();
    if (b.numPassingTests === 0) {
      console.log(chalk.white.bgRed.bold(' ' + 'TEST' + this.index.toString() + ' '), chalk.red.bold('✖'));
      this.allPassed = false;
    } else {
      console.log(chalk.white.bgGreen.bold(' ' + 'TEST' + this.index.toString() + ' '), chalk.green.bold('✔'));
    }
    this.index++;
    this.spinner.start();
  }

  // onTestCaseResult(_, testCase) {
  // console.log(testCase);
  // this.spinner.stop();
  // if (testCase.status === 'failed') {
  //   console.log(chalk.white.bgRed.bold(' ' + testCase.title + ' '), chalk.red.bold('✖'));
  //   this.allPassed = false;
  // } else {
  //   console.log(chalk.white.bgGreen.bold(' ' + testCase.title + ' '), chalk.green.bold('✔'));
  // }
  // this.spinner.start();
  // }

  onRunComplete(_, results) {
    this.spinner.stop();
    console.log('');
    console.log(
      chalk.white.bgGray.bold(' TOTAL '),
      '|',
      chalk.white.bgRed.bold(' FAILED '),
      '|',
      chalk.white.bgGreen.bold(' PASSED '),
    );
    console.log('--------+----------+---------');
    console.log(
      results.numTotalTestSuites,
      ' '.repeat(7 - Math.round(results.numTotalTestSuites / 10)) + '|',
      results.numFailedTestSuites,
      ' '.repeat(7 - Math.round(results.numFailedTestSuites / 10)) + '|',
      results.numPassedTestSuites,
    );

    console.log('');
    if (this.allPassed) {
      console.log(chalk.green.bold('All tests passed!'));
    } else {
      console.log(chalk.red.bold('Some tests failed!'));
    }
  }
}