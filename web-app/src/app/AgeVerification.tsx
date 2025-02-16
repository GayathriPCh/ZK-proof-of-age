import { useState } from "react";
import * as snarkjs from "snarkjs";

const AgeVerificationForm = () => {
  const [age, setAge] = useState<number>(0);
  const [proof, setProof] = useState<any>(null);
  const [error, setError] = useState<string>("");

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAge(Number(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setError(""); // Reset any previous errors

      // Load the ZKP verification key and WASM files
      const verificationKey = await fetch("/zksnark/verification_key.json").then((res) =>
        res.json()
      );
      const wasmFile = await fetch("/zksnark/age_check_js/age_check.wasm").then((res) =>
        res.arrayBuffer()
      );

      // Prepare the input signals (the data to prove)
      const inputSignals = { age: age };

      // Use a unique name for the witness file (in-memory as a blob or a file)
      const witnessFileName = "witness.wtns";

      // Generate the witness and write it to the file
      await snarkjs.wtns.calculate(inputSignals, wasmFile, witnessFileName);

      // Now generate the proof using the zkey and the generated witness
      const witness = await fetch(`/zksnark/${witnessFileName}`).then((res) =>
        res.arrayBuffer()
      );

      // Convert ArrayBuffer to Uint8Array
      const witnessUint8Array = new Uint8Array(witness);

      // Generate the proof
      const { proof, publicSignals } = await snarkjs.groth16.prove(
        "/zksnark/age_check_final.zkey",
        witnessUint8Array // Use the correct format here
      );

      setProof({ proof, publicSignals });
    } catch (err) {
      setError("Error generating proof: " + err);
    }
  };

  // Add the handleVerify function to verify the proof
  const handleVerify = async () => {
    try {
      // Load the verification key from the file
      const verificationKey = await fetch("/zksnark/verification_key.json").then((res) =>
        res.json()
      );

      // Use snarkjs to verify the proof with the verification key
      const verified = await snarkjs.groth16.verify(
        verificationKey, // verification key
        proof.publicSignals, // public signals from the proof
        proof.proof // the proof itself
      );

      if (verified) {
        alert("Proof successfully verified!");
      } else {
        alert("Proof verification failed.");
      }
    } catch (err) {
      console.error("Verification error:", err);
      alert("Error during verification.");
    }
  };

  return (
    <div>
      <h1>Age Verification</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={age}
          onChange={handleAgeChange}
          placeholder="Enter your age"
        />
        <button type="submit">Generate Proof</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {proof && (
        <div>
          <h3>Generated Proof</h3>
          <pre>{JSON.stringify(proof, null, 2)}</pre>
          <button onClick={handleVerify}>Verify Proof</button>
        </div>
      )}
    </div>
  );
};

export default AgeVerificationForm;
