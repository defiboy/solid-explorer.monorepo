import { FileItem } from './FileItem'

export const defaultFileItem: FileItem = {
    name: 'Migrations.sol',
    path: '/Users/rickvazquez/smart-contracts/contracts/Migrations.sol',
    isDirectory: false,
    sourceCode:
        'pragma solidity >= 0.4.21 < 0.6.0; \n\ncontract Migrations { \n    address public owner; \n    uint public last_completed_migration; \n\n    constructor() public { \n        owner = msg.sender; \n } \n\n    modifier restricted() { \n        if (msg.sender == owner) _; \n } \n\n    function setCompleted(uint completed) public restricted { \n        last_completed_migration = completed; \n } \n\n    function upgrade(address new_address) public restricted { \n        Migrations upgraded = Migrations(new_address); \n        upgraded.setCompleted(last_completed_migration); \n } \n}\n',
    fileItems: undefined
}

export const buildFakeFileItem: (values?: FileItem | Partial<FileItem>) => FileItem = (
    values = defaultFileItem
): FileItem => {
    return {
        ...defaultFileItem,
        ...values
    }
}