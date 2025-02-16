pragma circom 2.2.1;

include "circomlib/circuits/bitify.circom";

template LessThan(n) {
    signal input in[2];
    signal output out;

    component bitsA = Num2Bits(n);
    component bitsB = Num2Bits(n);

    bitsA.in <== in[0];
    bitsB.in <== in[1];

    signal carry[n];

    carry[n-1] <== bitsA.out[n-1] & !bitsB.out[n-1];

    for (var i = n-2; i >= 0; i--) {
        carry[i] <== (bitsA.out[i] & !bitsB.out[i]) | (carry[i+1] & !(bitsA.out[i] ^ bitsB.out[i]));
    }

    out <== carry[0];
}
