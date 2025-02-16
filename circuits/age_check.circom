pragma circom 2.2.1;

include "circomlib/circuits/comparators.circom";  // Use circomlib's LessThan

template AgeCheck() {
    signal input age;
    signal output isAbove18;

    component check = LessThan(8);  // Check if age < 18
    check.in[0] <== 18;
    check.in[1] <== age;

    isAbove18 <== 1 - check.out;  // If age < 18, output 0; else 1
}

component main = AgeCheck();
