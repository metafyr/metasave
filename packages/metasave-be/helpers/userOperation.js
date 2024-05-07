import AA from './aa.js';
import {encodeFunctionData} from 'viem'

async function userOperation(abi, functionName, args, address, PRIV_KEY) {
  try {
    const callData = encodeFunctionData({
      abi,
      functionName,
      args,
    });

    const AAProvider = await AA(PRIV_KEY)

    console.log(PRIV_KEY, AAProvider.getAddress())

    const userOperation = await AAProvider.sendUserOperation({
      target: address, 
      data: callData,
    });

    const txHash = await AAProvider.waitForUserOperationTransaction(userOperation.hash);

    return txHash;
  } catch (error) {
    console.error(`Error in userOperation: ${error}`);
    throw error;
  }
}

export { userOperation };
