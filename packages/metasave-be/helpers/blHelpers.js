import { AAProvider } from '../controllers/fall/aa';
import {encodeFunctionData} from 'viem'

async function easUserOperation(abi, functionName, args) {
  try {
    const callData = encodeFunctionData({
      abi,
      functionName,
      args,
    });

    const userOperation = await AAProvider.sendUserOperation({
      target: abi.address, 
      data: callData,
    });

    const txHash = await AAProvider.waitForUserOperationTransaction(userOperation.hash);
    console.log(`Transaction successful with hash: ${txHash}`);

    return txHash;
  } catch (error) {
    console.error(`Error in easUserOperation: ${error}`);
    throw error;
  }
}

export { easUserOperation };
