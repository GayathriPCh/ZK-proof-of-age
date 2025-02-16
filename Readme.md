# Age Verification ZKP System with Circom and snarkjs (Next.js)

This project implements a basic **Age Verification DApp** using **Zero-Knowledge Proofs (ZKPs)**. The system allows users to prove they are above a certain age without revealing their exact age, using a **Circom circuit**, **snarkjs**, and a **trusted setup**.

## Overview of Steps

### 1️⃣ Write the Circom Circuit
The first step is to write a **Circom circuit** that represents the logic of age verification. The circuit takes the user's age as input and checks if it’s greater than or equal to a threshold (e.g., 18). The circuit ensures that the age remains private, and only a proof of validity is provided to the verifier.

### 2️⃣ Compile the Circuit
Once the circuit is written, it needs to be compiled into a form that can be used by snarkjs. This step generates several files, including:
- The **R1CS** file, which is the constraint system of the circuit.
- The **symbol** file, which contains information required for the witness generation.
- The **WASM** file, which is used to generate the witness on the frontend.

### 3️⃣ Generate the Witness
The **witness** is generated from the user's input (in this case, the user's age). The witness represents the private input and is used as part of the proof generation process. The witness allows us to prove that the user's age meets the required threshold without revealing the exact value.

### 4️⃣ Trusted Setup (Powers of Tau & Phase 2)
To secure the cryptographic operations in the ZKP system, a **trusted setup** is required. This setup is done in two phases:
- **Powers of Tau**: This phase generates a random value for the setup.
- **Phase 2**: This phase finalizes the setup and generates the **ZKey** file (`age_check_final.zkey`), which is used in the proof generation process.

### 5️⃣ Generate the Proof
Using the **witness** and the **ZKey** file from the trusted setup, a **ZKP** proof is generated. This proof confirms that the user's age is valid (i.e., above the threshold) without revealing the exact age.

### 6️⃣ Verify the Proof
The final step is to **verify** the generated proof. The proof is verified using the **verification key** and the **public signals** from the proof. If the proof is valid, the verification will confirm that the user is indeed above the required age without disclosing their actual age.

## Frontend Integration (Next.js + snarkjs)

On the frontend, the process is integrated into a **Next.js** application:
- The user inputs their age into a form.
- The **snarkjs** library is used to load the WASM file and the verification key.
- The **proof** is generated using the witness and the trusted setup files.
- The proof can then be verified on the backend or client-side.

## Files and Structure

### ZK-Snark Files:
- **age_verifying.circom**: The main Circom circuit that checks if the user is above a certain age.
- **verification_key.json**: The verification key used for verifying the proof.
- **age_check_final.zkey**: The final setup file created during the trusted setup process.
- **age_check.wasm**: The compiled WASM file used for generating the witness on the frontend.

### Backend (snarkjs)
- **generate_witness.js**: A script used to generate the witness file from the user's input.
- **groth16**: The cryptographic algorithm used to generate and verify the proof.

### Frontend (Next.js + TypeScript)
- **AgeVerification.tsx**: A Next.js component that handles the user's input and manages the proof generation process.
- **pages/index.tsx**: The entry point of the Next.js app that integrates the age verification functionality.
- **public/**: Contains the compiled **WASM** file and **verification key** for the frontend.

## How It Works

1. The user enters their age in the provided form on the **Next.js** frontend.
2. The app uses **snarkjs** to generate the **witness** from the input.
3. The app loads the **verification key** and **WASM file** from the public directory.
4. The **proof** is generated using the **ZKey** and the generated witness.
5. The proof can be verified using the **verification key** to ensure that the user’s age is valid.

## Conclusion

This ZKP-based Age Verification system ensures privacy by allowing users to prove they meet an age requirement without revealing their actual age. It uses Circom for the circuit and snarkjs for proof generation and verification, making it a secure and privacy-preserving solution.