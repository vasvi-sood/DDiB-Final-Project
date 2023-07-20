import React, { useState } from 'react';
import { CheckCircleIcon, SettingsIcon } from '@chakra-ui/icons';
import { Heading, VStack, List, ListIcon, ListItem, Button, Input } from '@chakra-ui/react';
import { ethers } from 'ethers';

// Replace with your contract address and ABI
const contractAddress = '0x98f100F4687a2477dB9a197d58118260972e3120';
const contractABI = `[
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "orgAddress",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "amountToCollect",
				"type": "uint256"
			}
		],
		"name": "addOrganization",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "donate",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "getOrganizationDetails",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "organizations",
		"outputs": [
			{
				"internalType": "address",
				"name": "orgAddress",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "amountToCollect",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "amountCollected",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]`; // Replace with your contract's ABI

const Home = () => {
  // State to hold the donation amount entered by the user
  const [donationAmount, setDonationAmount] = useState('');
  // State to hold the organization ID for donation
  const [organizationId, setOrganizationId] = useState('');

  const handleDonate = async () => {
    // Check if a valid amount is entered
    if (Number(donationAmount) <= 0 || isNaN(Number(donationAmount))) {
      console.error('Please enter a valid donation amount.');
      return;
    }

    // Check if a valid organization ID is entered
    if (!organizationId || isNaN(Number(organizationId))) {
      console.error('Please enter a valid organization ID.');
      return;
    }

    // Connect to the provider (Ethereum network)
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    // Get the signer (connected wallet) from the provider
    const signer = provider.getSigner();

    // Create an instance of the contract using the contract ABI and address
    const donationContract = new ethers.Contract(contractAddress, contractABI, signer);
console.log(donationContract)
    try {
      // Call the donate function of the contract with the specified donation amount and organization ID
      const donationTx = await donationContract.donate(organizationId, {
        value: ethers.utils.parseEther(donationAmount), // Convert the donation amount to Wei (Ethereum's smallest unit)
      });

      // Wait for the transaction to be mined (confirmed)
      await donationTx.wait();
      console.log('Donation successful! Transaction hash:', donationTx.hash);

      // Clear the donation amount input field after a successful donation
      setDonationAmount('');
      setOrganizationId('');
    } catch (error) {
      console.error('Error donating:', error);
    }
  };

  return (
    <VStack w={'full'}>
      <Heading size="md" marginBottom={6}>
        Example Charity Organization
      </Heading>
      <p>We aim to make the world a better place!</p>
      <p>
        Amount to Fundraise: 100000 | Amount Collected: 75000
      </p>
      <Input
        placeholder="Enter organization ID"
        value={organizationId}
        onChange={(e) => setOrganizationId(e.target.value)}
      />
      <Input
        placeholder="Enter donation amount"
        value={donationAmount}
        onChange={(e) => setDonationAmount(e.target.value)}
      />
      <Button colorScheme="green" onClick={handleDonate}>
        Donate
      </Button>
      <List spacing={3}>
        {/* Existing list items */}
        <ListItem>
          <ListIcon as={CheckCircleIcon} color="green.500" />
          Moralis authentication
        </ListItem>
        {/* Add more list items as needed */}
      </List>
    </VStack>
  );
};

export default Home;
