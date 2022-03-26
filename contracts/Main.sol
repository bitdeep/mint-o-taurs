//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

// import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
contract Main is ERC721Enumerable, Ownable {
    string private _baseURIPrefix;
    uint256 public TOTAL_SUPPLY = 100;
    uint256 public PRICE = 5 ether;
    address public FEE_RECIPIENT;
    bool public SALE_ACTIVE = false;
    constructor() ERC721("Test NFT", "TNFT") {
        FEE_RECIPIENT = msg.sender;
    }
    function setFeeRecipient(address to) public onlyOwner {
        FEE_RECIPIENT = to;
    }
    function setSaleStatus(bool status) public onlyOwner {
        SALE_ACTIVE = status;
    }
    function setPrice(uint val) public onlyOwner {
        PRICE = val;
    }
    function setSupply(uint val) public onlyOwner {
        TOTAL_SUPPLY = val;
    }
    function mint(uint numberOfTokens) public payable {
        require(SALE_ACTIVE, "Pre-sale must be active to mint");
        require(totalSupply()+numberOfTokens <= TOTAL_SUPPLY, "Purchase would exceed max supply of tokens");
        require(PRICE*numberOfTokens == msg.value, "Ether value sent is not correct");
        for(uint i = 0; i < numberOfTokens; i++) {
            _safeMint(msg.sender, totalSupply());
        }
        (bool transferStatus,) = FEE_RECIPIENT.call{value : msg.value}("");
        require(transferStatus, "Failed to send to FEE_RECIPIENT");
    }
    function adminMint(uint numberOfTokens) public onlyOwner {
        for(uint i = 0; i < numberOfTokens; i++) {
            uint mintIndex = totalSupply();
            if (totalSupply() < TOTAL_SUPPLY) {
                _safeMint(msg.sender, mintIndex);
            }
        }
    }
    function _baseURI() internal view override returns (string memory) {
        return _baseURIPrefix;
    }
    function tokenURI(uint256 tokenId)
    public
    view
    override(ERC721)
    returns (string memory)
    {
        return string(abi.encodePacked(super.tokenURI(tokenId), ".json"));
    }
    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseURIPrefix = baseURI;
    }
}
