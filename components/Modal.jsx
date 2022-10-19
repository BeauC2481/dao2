import { useRef, useState } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import Input from './Input';
import Button from './Button';
import Loader from './Loader';

import images from '../assets';

import DAOAddress from '../pages/contractsData/dao-address.json';
import DAOAbi from '../pages/contractsData/dao.json';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';


const Modal = ({ header, footer, handleClose, button }) => {
  const modalRef = useRef(null);
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [addressTo, setAddressTo] = useState("");
  const [description, setDescription] = useState("");

  if (isLoading) {
    handleClose();
  }

  // check if it is cliked outside of modalRef
  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      handleClose();
    }
  };

  const createProposal = async () => {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const daoContract = new ethers.Contract(
        DAOAddress.address,
        DAOAbi.abi,
        signer
      );

      setIsLoading(true);
      const formattedAmount = ethers.utils.parseUnits(amount.toString(), 'ether');
      const txn = await daoContract.createProposal(title, formattedAmount, addressTo, description);
      await txn.wait();
      await getNumProposalsInDAO();
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };


  if (isLoading) return (
    <div className='text-center'>
        <main style={{ padding: "1rem 0" }}>
            <h2><Loader /></h2>
        </main>
    </div>
  )


  return (
    <div
      onClick={handleClickOutside}
      className="flexCenter fixed inset-0 z-10 bg-overlay-black animated fadeIn"
    >
      <div ref={modalRef} className="w-3/5 md:w-11/12 minlg:w-2/4 bg-nft-dark flex flex-col rounded-lg">
        <div className="flex justify-end mt-4 mr-4 minlg:mr-6">
          <div className="relative w-3 h-3 minlg:w-6 minlg:h-6 cursor-pointer" onClick={handleClose}>
            <Image src={images.cross} layout="fill" className={theme === 'light' ? 'filter invert' : undefined} />
          </div>
        </div>

        <div className="flexCenter w-full text-center lg:p-4">
          <h2 className="font-poppins text-white font-normal text-2xl">{header}</h2>

        </div>
        <div className="minmd:px-10 sm:px-10 border-t border-b border-nft-black-3">
        <div className="justify-start lg:p-10 rounded-[10px] drop-shadow-sm dark:drop-shadow-xl">
          <div className="flex w-full justify-start sm:px-4">
            <div className="w-full md:w-full">
              <Input
                inputType="input"
                title="Title"
                placeholder="Name your proposal ..."
                handleClick={(e) => setTitle(e.target.value)}
              />
              <Input
                inputType="number"
                title="Amount"
                placeholder="Token Amount"
                handleClick={(e) => setAmount(e.target.value)}
              />
              <Input
                inputType="input"
                title="Address"
                placeholder="Address To"
                handleClick={(e) => setAddressTo(e.target.value)}
              />
              <Input
                inputType="textarea"
                title="Description"
                placeholder="Describe your proposal ..."
                handleClick={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        </div>
        </div>
          <div className="flexCenter p-4 pb-10">
            <Button 
              btnName="Create Proposal"
              btnType="primary"
              classStyles="rounded-xl"
              handleClick={createProposal}
            />
          </div>
      </div>
    </div>
  );
};

export default Modal;
