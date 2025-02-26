import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import { Config } from "./000_Config";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, getChainId } = hre;
  const { deploy } = deployments;

  const chainId = await getChainId();
  const { deployer } = await getNamedAccounts();

  await deploy("ReturnProfit", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
    gasLimit: Config[chainId].gasLimit,
    gasPrice: Config[chainId].gasPrice,
    nonce: 10,
  });

  await new Promise((resolve) => setTimeout(resolve, Config[chainId].sleep));
  console.log(":: Deployed ReturnProfit: ", (await deployments.get("ReturnProfit")).address);
};

export default func;
func.tags = ["SmartVault", "Action", "ReturnProfit"];
func.dependencies = ["PositionManagerFactory"];
