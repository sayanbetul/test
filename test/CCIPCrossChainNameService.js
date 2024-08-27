const { expect } = require("chai");
const { ethers } = require("hardhat");
// CCIPCrossChainNameService.js dosyasında
// CCIPCrossChainNameService.js

(async () => {
    const chai = await import('chai');
    const { expect } = chai;
  
    describe("CCIP Cross Chain Name Service", function () {
      it("should register a name and return the correct address", async function () {
        
        let CCIPLocalSimulator, localSimulator, routerAddress;
        let CrossChainNameServiceRegister, registerContract;
        let CrossChainNameServiceReceiver, receiverContract;
        let CrossChainNameServiceLookup, lookupContract;
        let aliceEOA, owner;
    
        before(async function () {
            [owner, aliceEOA] = await ethers.getSigners();
    
            // CCIPLocalSimulator.sol akıllı sözleşmesinin bir örneğini oluşturun.
            CCIPLocalSimulator = await ethers.getContractFactory("CCIPLocalSimulator");
            localSimulator = await CCIPLocalSimulator.deploy();
            await localSimulator.deployed();
    
            // Router sözleşme adresini almak için configuration() fonksiyonunu çağırın.
            routerAddress = await localSimulator.configuration();
    
            // CrossChainNameServiceRegister sözleşmesinin örneğini oluşturun.
            CrossChainNameServiceRegister = await ethers.getContractFactory("CrossChainNameServiceRegister");
            registerContract = await CrossChainNameServiceRegister.deploy(routerAddress);
            await registerContract.deployed();
    
            // CrossChainNameServiceReceiver sözleşmesinin örneğini oluşturun.
            CrossChainNameServiceReceiver = await ethers.getContractFactory("CrossChainNameServiceReceiver");
            receiverContract = await CrossChainNameServiceReceiver.deploy(routerAddress);
            await receiverContract.deployed();
    
            // CrossChainNameServiceLookup sözleşmesinin örneğini oluşturun.
            CrossChainNameServiceLookup = await ethers.getContractFactory("CrossChainNameServiceLookup");
            lookupContract = await CrossChainNameServiceLookup.deploy(routerAddress);
            await lookupContract.deployed();
    
            // enableChain() fonksiyonunu gerekli yerlerde çağırın.
            await registerContract.enableChain(receiverContract.address);
            await receiverContract.enableChain(registerContract.address);
        });
    
        it("Should register and lookup the name", async function () {
            // register() fonksiyonunu çağırın.
            await registerContract.connect(owner).register("alice.ccns", aliceEOA.address);
    
            // lookup() fonksiyonunu çağırın.
            const lookupAddress = await lookupContract.lookup("alice.ccns");
    
            // Döndürülen adresin Alice’in EOA adresi olduğunu doğrulayın.
            expect(lookupAddress).to.equal(aliceEOA.address);
        });
    });
    

      });
    });
    