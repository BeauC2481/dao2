import React, { useState, useEffect } from 'react';
import { Button, Modal, SearchBar, PostCardButton, ProposalCard, shortenAddress, Loader } from '../components';
import Web3Modal from 'web3modal';
import images from '../assets'
import Image from 'next/image';
import { ethers } from 'ethers';

import DAOAddress from './contractsData/dao-address.json';
import DAOAbi from './contractsData/dao.json';


const Home = () => {
  const [activeSelect, setActiveSelect] = useState('Recently Added');
  const [isLoading, setIsLoading] = useState(false);

  const [paymentModal, setPaymentModal] = useState(false);

  const [proposals, setProposals] = useState([]);
  const [numProposals, setNumProposals] = useState("0");


  const getNumProposalsInDAO = async () => {
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
      
      const daoNumProposals = await daoContract.numProposals();
      setNumProposals(daoNumProposals.toString());
    } catch (error) {
      console.log(error);
    }
  }


  const fetchProposalById = async (id) => {
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

      const proposal = await daoContract.proposals(id);
      const parsedProposal = {
        proposalId: id,
        title: proposal.title.toString(),
        description: proposal.description.toString(),
        amount: proposal.amount.toString(),
        deadline: new Date(parseInt(proposal.deadline.toString()) * 1000),
        yesVotes: proposal.yesVotes.toString(),
        noVotes: proposal.noVotes.toString(),
        addressTo: proposal.addressTo.toString(),
        executed: proposal.executed,
      };
      return parsedProposal;
    } catch (error) {
      console.log(error);
    }
  }


  const fetchProposals = async () => {
    try {
      const proposals = [];
      for (let i = 0; i < numProposals; i++) {
        const proposal = await fetchProposalById(i);
        proposals.push(proposal);
      }
      setProposals(proposals.sort((a, b) => b.proposalId - a.proposalId));
      return proposals;
    } catch (error) {
      console.log(error);
    }
  }


  const voteOnProposal = async (proposalId, _vote) => {
    try{
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const daoContract = new ethers.Contract(
        DAOAddress.address,
        DAOAbi.abi,
        signer
      );

      let txn;
      setIsLoading(true);
      let vote = _vote === "YAY" ? 0 : 1;
      txn = await daoContract.voteOnProposal(proposalId, vote);
      await txn.wait();
      await fetchProposals();
      setIsLoading(false);
      } catch (error) {
        console.log(error)
      }
  }

  
  const executeProposal = async (proposalId) => {
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
      const txn = await daoContract.executeProposal(proposalId);
      await txn.wait();
      await fetchProposals();
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  }


  const PostCard = ({ proposalId, amount, deadline, yesVotes, noVotes, addressTo, executed, description, title }) => {
    return (
      <div className="flex w-full dark:bg-nft-black-3 bg-white rounded-2xl p-3 m-4 minlg:m-8 sm:my-2 sm:mx-2 cursor-pointer shadow-md">
        <div className="w-full rounded-2xl overflow-hidden">
      
          <div className='flex flex-row border-b-[2px] border-nft-gray-2 rounded-sm'>
            <div className='flex w-full pb-2 px-2'>
              <Image src={images.logo02} layout="fixed" width='40' height='40' alt='proposal' className='rounded-[6px]' />
              <p className='p-1 mx-2 text-lg font-bold'>{title}</p>
            </div>
              <div className='flex justify-center pb-2'>
                <p className='flex w-full justify-end font-semibold lg:px-5 px-2'>Amount: {amount/1000000000000000000}</p>
                <p className='flex w-full font-semibold mr-2 justify-end'>Address To: {shortenAddress(addressTo)}</p>
              </div>
          </div>


        <div className='flex flex-row w-full pt-2 font-medium'>

          <div className='flex flex-col w-full'>
            <div className='w-full h-full border-b-[2px] border-nft-gray-2 px-3 pb-4 pt-2'>
              {description}
            </div>
                <div className='flex flex-row w-full pt-2 pl-2 pr-4'>
                  {deadline.getTime() > Date.now() && !executed ? (
                    <div className='flex w-full'>
                      <div className='flex flex-row p-2'>
                        <PostCardButton 
                          btnName={`Vote Yes`}
                          classStyles={"rounded-xl"}
                          handleClick={() => voteOnProposal(proposalId, "YAY")}
                        />
                      </div>
                      <div className='pt-2 px-2'>
                        <PostCardButton 
                          btnName={"Vote No"}
                          classStyles={"rounded-xl px-7"}
                          handleClick={() => voteOnProposal(proposalId, "NAY")}
                        />
                      </div>
                    </div>
                  ) : deadline.getTime() < Date.now() && !executed ? (
                    <div className='flex flex-row p-2 w-full'>
                        <PostCardButton 
                          btnName={`Execute Proposal`}
                          classStyles={"rounded-xl"}
                          handleClick={() => executeProposal(proposalId)}
                        />
                    </div>
                    
                  ) : (
                    <div className='flex w-full pt-2 px-2 font-semibold text-lg'>
                      Executed
                    </div>
                  )}

                  <div className='flex w-full justify-end items-center'>
                    <div className='mt-2 px-4'>
                      Votes Yes: {yesVotes}
                    </div>
                    <div className='mt-2'>
                    Votes No: {noVotes}
                    </div>
                  </div>
                </div>
          </div>
        </div>


        </div>
      </div>
  );
  };    
  



  useEffect(() => {
    setIsLoading(true);
    getNumProposalsInDAO()
    fetchProposals();
    setIsLoading(false);
  })

  useEffect(() => {
    const sortedProposals = [...proposals];

    switch (activeSelect) {
      case 'Votes For':
        setProposals(sortedProposals.sort((a, b) => b.votesYes - a.votesYes));
        break;
      case 'Votes Against':
        setProposals(sortedProposals.sort((a, b) => b.votesNo - a.votesNo));
        break;
      case 'Recently Added':
        setProposals(sortedProposals.sort((a, b) => b.proposalId - a.proposalId));
        break;
      default:
        setProposals(proposals);
        break;
    }
  }, [activeSelect]);


  const onHandleSearch = (value) => {
    const filteredProposals = proposals.filter(({ title }) => title.toLowerCase().includes(value.toLowerCase()));

    if (filteredProposals.length === 0) {
      setProposals(proposals);
    } else {
      setProposals(filteredProposals);
    }
  };

  const onClearSearch = () => {
    if (proposals.length && proposals.length) {
      setProposals(proposals);
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
    <div className='flex w-full'>
      <div className="flex flex-col w-full justify-center items-center">

      <div className="flex flex-col w-full items-center p-5 mx-3 py-10">
        <Button 
          btnName="Create A Proposal"
          btnType="primary"
          classStyles="rounded-xl text-xl px-20"
          handleClick={() => setPaymentModal(true)}
        />
        <div className="flex w-2/3 sm:w-full flex flex-row sm:flex-col py-10">
          <SearchBar activeSelect={activeSelect} setActiveSelect={setActiveSelect} handleSearch={onHandleSearch} clearSearch={onClearSearch} />
        </div>

      <div>
      {paymentModal && (
        <Modal
          header="Create A Proposal"
          handleClose={() => setPaymentModal(false)}
        />
      )}
      </div>

        {proposals.length > 0 ? (
          <div className='flex flex-col w-full justify-center items-center'>
            {proposals.map((proposal, index) => 
              <div className='flex flex-wrap w-2/3 sm:w-full px-2'>
                <ProposalCard key={index} proposal={proposal} />
              </div>
              )}
          </div>
        ) : (
          <div className='flex flex-col w-full items-center font-semibold text-2xl py-20'>
            No Proposals Yet ...
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default Home;
