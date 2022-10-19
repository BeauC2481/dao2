import React, {useEffect, useState} from 'react'
import Image from 'next/image';
import Link from 'next/link';
import images from '../assets';
import { shortenAddress } from './shortenAddress';
import { PostCardButton } from '.';

const ProposalCard = ({ proposal }) => {
    const [prop, setProp] = useState({ id: "" });

    useEffect(() => {
        if (!prop) {
            setProp(proposal.proposalId)
        }
    })

  return (
        <div className="flex-1 w-full xs:max-w-none sm:w-full sm:min-w-155 dark:bg-nft-black-3 bg-white rounded-2xl p-4 m-4 sm:my-2 sm:mx-2 cursor-pointer shadow-md dropdown dropbtn">
          <div className='flex flex-row border-b-[2px] border-nft-gray-2 rounded-sm pb-2 items-center'>
              <Image src={images.logo02} layout="fixed" width='30' height='30' alt='proposal' className='rounded-[6px]' />
              <div className='flex items-center px-3 font-bold text-xl'>
                  {proposal.proposalId + 1}: {proposal.title}
              </div>
          </div>
          <div className="relative w-full rounded-2xl overflow-hidden">
          </div>
          <div className="mt-3 flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div className="flexBetween mt-1 minlg:mt-3 flex-row xs:flex-col xs:items-start xs:mt-3">
                  <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-sm minlg:text-xl">{proposal.amount / 1000000000000000000}<span className="font-normal">  GT</span></p>
                  <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xs minlg:text-lg">Votes For: {proposal.yesVotes / 1000000000000000000}</p>
              </div>
              <div className="flexBetween mt-1 minlg:mt-3 flex-row xs:flex-col xs:items-start xs:mt-3">
                  <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xs minlg:text-lg">{shortenAddress(proposal.addressTo)}</p>
                  <p className="sm:items-end font-poppins dark:text-white text-nft-black-1 font-semibold text-xs minlg:text-lg">Votes Against: {proposal.noVotes / 1000000000000000000}</p>
              </div>
              <div className="mt-1 minlg:mt-3 flexBetween flex-row" />

          </div>
            <div className='flex flex-row w-full justify-center items-center dropdown-content'>
                <div className='flex w-3/4 pt-2 pb-4 pr-2 text-sm'>
                    {proposal.description}
                </div>
                {proposal.deadline.getTime() > Date.now() && !proposal.executed ? (
                    <div className='flex w-full'>
                    <div className='flex flex-row'>
                        <PostCardButton 
                        btnName={`Vote Yes`}
                        classStyles={"rounded-xl sm-text-sm"}
                        handleClick={() => voteOnProposal(proposalId, "YAY")}
                        />
                    </div>
                    <div className='px-5'>
                        <PostCardButton 
                            btnName={"Vote No"}
                            classStyles={"rounded-xl px-7 sm:text-sm"}
                            handleClick={() => voteOnProposal(proposalId, "NAY")}
                        />
                    </div>
                </div>
                ) : proposal.deadline.getTime() < Date.now() && !proposal.executed ? (
                    <div className='flex flex-row w-full'>
                        <PostCardButton 
                            btnName={`Execute Proposal`}
                            classStyles={"rounded-xl"}
                            handleClick={() => executeProposal(proposalId)}
                        />
                    </div>
                    ) : (
                        <div className='flex w-full font-semibold text-lg'>
                        Executed
                        </div>
                    )}
            </div>
      </div>
  )
}

export default ProposalCard;
