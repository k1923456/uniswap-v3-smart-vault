import { ethers, network, run } from "hardhat";

import { Config } from "../deploy/000_Config";
import {
  ClosePosition,
  DepositRecipes,
  IERC20,
  IUniswapV3Factory,
  IUniswapV3Pool,
  IWETH9,
  IdleLiquidityModule,
  IncreaseLiquidity,
  Mint,
  MockToken,
  PositionManagerFactory,
  Registry,
  RepayRebalanceFee,
  ReturnProfit,
  ShareProfit,
  SingleTokenIncreaseLiquidity,
  StrategyProviderWalletFactory,
  SwapToPositionRatio, // Timelock,
  WithdrawRecipes,
  ZapIn,
} from "../types";

async function main() {
  const WAIT_BLOCK_CONFIRMATIONS = 6;

  const tokenWMATIC = (await ethers.getContractAt("IWETH9", "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270")) as IWETH9;

  const depositRecipesAddress = "0x848f48d5Ec66B36F01FCC5967e5662d77eFcb144";
  const depositRecipes = (await ethers.getContractAt("DepositRecipes", depositRecipesAddress)) as DepositRecipes;

  await tokenWMATIC.approve(depositRecipes.address, 30n * 10n ** 18n, {
    gasPrice: Config[137].gasPrice,
    gasLimit: Config[137].gasLimit,
  });

  const txn = await depositRecipes.singleTokenDeposit(
    {
      token0: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
      token1: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
      fee: 3000,
      tickLowerDiff: "-600",
      tickUpperDiff: "600",
      amountIn: 30n * 10n ** 18n,
      isToken0In: true,
      strategyId: ethers.utils.hexZeroPad(ethers.utils.hexlify(1), 16),
    },
    {
      gasPrice: Config[137].gasPrice,
      gasLimit: Config[137].gasLimit,
    },
  );
  console.log(`Create position manager txn hash: ${txn.hash}...`);
  await txn.wait(WAIT_BLOCK_CONFIRMATIONS);

  console.log(`Deposit txn confirmed!`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
