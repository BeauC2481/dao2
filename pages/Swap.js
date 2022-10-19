import React, { useState, useContext, useEffect } from 'react';
import { TbArrowsDownUp } from 'react-icons/tb';
import Web3Modal from 'web3modal';
import Web3 from 'web3';
import { ethers } from 'ethers';

import { Button, Input } from '../components';
import SwapAddress from './contractsData/etherswap-address.json';
import SwapAbi from './contractsData/etherswap.json';


const Swap = () => {
  const [Eth, setEth] = useState('');
  const [GT, setGT] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [exchange, setExchange] = useState(1);


  const buyTokens = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const swapContract = new ethers.Contract(
      SwapAddress.address,
      SwapAbi.abi,
      signer
    );

    setIsLoading(true);
    const price = ethers.utils.parseUnits(Eth.toString(), 'ether');
    const txn = await swapContract.buyTokens({ value: price });
    await txn.wait();
    setIsLoading(false);
  }


  const sellTokens = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const swapContract = new ethers.Contract(
      SwapAddress.address,
      SwapAbi.abi,
      signer
    );

    setIsLoading(true);
    const txn = await swapContract.sellTokens(ethers.utils.parseUnits(GT.toString()));
    await txn.wait();
    setIsLoading(false);
  }


  const _setExchange = async () => {
    if (exchange === 1) {
      setExchange(2);
    } else {
      setExchange(1);
    }
    console.log(exchange);
  }


  return (
    <div>
      {exchange === 1 ? (
        <div className="flex justify-center sm:px-4 p-12 w-full h-full">
          <div className="flex flex-col items-center justify-start h-full w-full mt-0 minmd:mb-20 minmd:pt-20 minmd:pb-40">
            <div className="white-glassmorphism py-4 md:py-6 lg:py-10 px-2 max-w-md w-full bg-gray-800 opacity-90 rounded-[5%] drop-shadow-2xl">
              <div className="flex flex-col mx-8">
                <h3 className="text-white text-xl pb-4 font-bold text-center mb-1">Swap Ethereum For Governor Token</h3>
              </div>
              <div className="h-[1px] w-full bg-nft-gray-1 my-2" />
              <div className="flex flex-col">
                <div className="flex flex-col px-5 py-3 items-start h-full">
                  <Input placeholder="0.00" title="Ethereum" symbol="ETH" inputType="number" handleClick={(e) => setEth(e.target.value)} />
                </div>
                  <div className='flex justify-center items-center font-semibold pt-6'>
                    <button className='rounded-full' onClick={_setExchange}>
                      <TbArrowsDownUp className='text-3xl font-bold p-1 bg-nft-black-1 hover:bg-nft-gray-2 hover:mouse-pointer rounded-full' />
                    </button>
                  </div>
                <div className="flex flex-col px-5 py-3 items-start h-full">
                <div className="mt-5 w-full">
                  <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-lg">Governor Token</p>
                  <div className="dark:bg-nft-black-1 bg-white border dark:border-nft-black-1 border-nft-gray-2 rounded-lg w-full outline-none font-poppins dark:text-white text-nft-gray-2 text-base mt-4 px-4 py-3 flexBetween flex-row">
                    <div className='flex-1 w-full dark:bg-nft-black-1 bg-white outline-none'>
                      {Eth * 100}
                    </div>
                      <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-md">GT</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col w-full px-2 pt-12">
                <Button
                  btnName="Swap"
                  btnType="primary"
                  classStyles="rounded-xl py-3"
                  handleClick={buyTokens}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center sm:px-4 p-12 w-full h-full">
          <div className="flex flex-col items-center justify-start h-full w-full mt-0 minmd:mb-20 minmd:pt-20 minmd:pb-40">
            <div className="white-glassmorphism py-4 md:py-6 lg:py-10 px-2 max-w-md w-full bg-gray-800 opacity-90 rounded-[5%] drop-shadow-2xl">
              <div className="flex flex-col mx-8">
                <h3 className="text-white text-xl pb-4 font-bold text-center mb-1">Swap Governor Token For Ethereum</h3>
              </div>
              <div className="h-[1px] w-full bg-nft-gray-1 my-2" />
              <div className="flex flex-col">
                <div className="flex flex-col px-5 py-3 items-start h-full">
                  <Input placeholder="0.00" title="Governor Token" symbol="GT" inputType="number" handleClick={(e) => setGT(e.target.value)} />
                </div>
                  <div className='flex justify-center items-center font-semibold pt-6'>
                    <button className='rounded-full' onClick={_setExchange}>
                      <TbArrowsDownUp className='text-3xl font-bold p-1 bg-nft-black-1 hover:bg-nft-gray-2 hover:mouse-pointer rounded-full' />
                    </button>
                  </div>
                <div className="flex flex-col px-5 py-3 items-start h-full">
                <div className="mt-5 w-full">
                  <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-lg">Ethereum</p>
                  <div className="dark:bg-nft-black-1 bg-white border dark:border-nft-black-1 border-nft-gray-2 rounded-lg w-full outline-none font-poppins dark:text-white text-nft-gray-2 text-base mt-4 px-4 py-3 flexBetween flex-row">
                    <div className='flex-1 w-full dark:bg-nft-black-1 bg-white outline-none'>
                      {GT / 100}
                    </div>
                      <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-md">ETH</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col w-full px-2 pt-12">
                <Button
                  btnName="Swap"
                  btnType="primary"
                  classStyles="rounded-xl py-3"
                  handleClick={sellTokens}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Swap;
