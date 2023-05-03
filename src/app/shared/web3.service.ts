import { Inject, Injectable, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Observable, Subject } from 'rxjs';

import { environment } from '../../environment/environment';

import Web3 from 'web3';
import { AbiItem } from 'web3-utils';

import { NotificationService } from './notification.service';
import { TradeRole, TradeStatus } from '../components/my-trades/my-trades.component';
import { ChainEventsService } from './chain-events.service';

interface CSXInstance {
  window: Document | any;
  tradeFactory: any;
  usersContract: any;
  WETHToken: any;
  USDCToken: any;
  USDTToken: any;
  CSXToken: any;
  sCSXToken: any;
  eCSXToken: any;
  vCSXToken: any;
  accountSubject: Subject<any>;
}

interface Balance {
  balanceWei: string;
  balanceEth: string;
}

interface Balances {
  [key: string]: Balance;
}

interface WebUser {
  address?: string;
  shortAddy?: string;
  myAccount$?: Observable<any>;
  // balanceWei?: string;
  // balanceEth?: string;
  balances: Balances;
  isWrongChain: boolean;
  isConnected: boolean;
  isUserWalletConnected: boolean;
  hasEthWallet?: boolean;
  itemGetInfo?: any;
}

@Injectable({
  providedIn: 'root',
})
export class Web3Service implements OnDestroy {
  public csxInstance: CSXInstance = {
    window: undefined,
    tradeFactory: undefined,
    usersContract: undefined,
    accountSubject: new Subject<any>(),
    CSXToken: undefined,
    sCSXToken: undefined,
    eCSXToken: undefined,
    vCSXToken: undefined,
    WETHToken: undefined,
    USDCToken: undefined,
    USDTToken: undefined
  };

  public webUser: WebUser = {
    balances: {
      ETH: {
        balanceWei: '0',
        balanceEth: '0',
      },
      WETH: {
        balanceWei: '0',
        balanceEth: '0',
      },
      USDC: {
        balanceWei: '0',
        balanceEth: '0',
      },
      USDT: {
        balanceWei: '0',
        balanceEth: '0',
      },
      CSX: {
        balanceWei: '0',
        balanceEth: '0',
      },
      sCSX: {
        balanceWei: '0',
        balanceEth: '0',
      },
      eCSX: {
        balanceWei: '0',
        balanceEth: '0',
      },
      vCSX: {
        balanceWei: '0',
        balanceEth: '0',
      },

    },
    isConnected: false,
    isUserWalletConnected: false,
    isWrongChain: true,
  };

  

  constructor(
    @Inject(DOCUMENT) private document: Document,
    public notificationsService: NotificationService,
    private chainEvents: ChainEventsService
  ) {
    this.webUser.myAccount$ = this.csxInstance.accountSubject.asObservable();
    this.preCheck();
  }

  preCheck() {
    this.csxInstance.window = this.document.defaultView;
    if (this.csxInstance.window.ethereum != undefined) {
      this.webUser.hasEthWallet = true;
      this._validateCorrectChain();
    } else {
      this.webUser.hasEthWallet = false;
    }
  }

  async initWallet() {
    // Init Metamask & fetch for webUser.
    await this._initMetaMaskAndFetchWebUser();
  }

  private async _initMetaMaskAndFetchWebUser() {
    this.csxInstance.window = this.document.defaultView;

    switch (true) {
      case this.csxInstance.window.ethereum != undefined:
        this.webUser.hasEthWallet = true;
        this._initWeb3Module();
        await this._validateCorrectChain().then(() => {
          this._onChainChangedListener();
          this._onAccountChangedListener();
          this._attemptMetamaskHandshake();
        });

        break;
      case this.csxInstance.window.ethereum == undefined:
        console.log('NO ETH');
        this.webUser.hasEthWallet = false;
        break;
      default:
        console.log('DEFAULTED');
        break;
    }
  }

  private _initWeb3Module() {
    this.csxInstance.window.web3 = new Web3(this.csxInstance.window.ethereum);
  }

  private async _validateCorrectChain() {
    const currentChainId = await this.csxInstance.window.ethereum.request({
      method: 'eth_chainId',
    });

    if (currentChainId != environment.NETWORK.chainId) {
      this.webUser.isWrongChain = true;
      this.notificationsService.openSnackBar(
        `Incorrect Network in MetaMask!`,
        'gg'
      );
    } else {
      this.webUser.isWrongChain = false;
    }
  }

  private _onChainChangedListener() {
    this.csxInstance.window.ethereum.on('chainChanged', async () => {
      console.log('chain changed!');
      //document.location.reload();
      let currentChainId = await this.csxInstance.window.ethereum.request({
        method: 'eth_chainId',
      });
      //console.log(this.window.ethereum.chainId)
      if (currentChainId != environment.NETWORK.chainId) {
        this.webUser.isWrongChain = true;
        this.webUser.isUserWalletConnected = false;
        this.webUser.isConnected = false;
        console.log('Incorrect Network in MetaMask!');
        //this._requestAddOrChangeNetwork();
      } else {
        if (
          this.webUser.isWrongChain &&
          currentChainId == environment.NETWORK.chainId
        ) {
          this.webUser.isWrongChain = false;
          document.location.reload();
        }
      }
    });
  }

  private _onAccountChangedListener() {
    this.csxInstance.window.ethereum.on(
      'accountsChanged',
      async (__accounts: any) => {
        console.log('acc changed!', __accounts[0]);

        this.webUser.address = __accounts[0];

        Web3.utils.toChecksumAddress(this.webUser.address!);

        this.webUser.balances!['ETH'].balanceWei =
          await this.csxInstance.window.web3.eth.getBalance(
            this.webUser.address
          );

        this.webUser.balances!['ETH'].balanceEth = parseFloat(
          Web3.utils.fromWei(
            await this.csxInstance.window.web3.eth.getBalance(this.webUser.address),
            'ether'
          )
        ).toFixed(3);

        this.csxInstance.accountSubject.next(__accounts[0]);

        //document.location.reload();
      }
    );
  }

  private async _attemptMetamaskHandshake() {
    if (!this.webUser.isWrongChain) {
      try {
        await this.__requestAddressAndBalance();
      } catch (error) {
        this.notificationsService.notify(
          'Error, you might need to refresh site or change RPC endpoint in wallet.'
        );
        console.log(error);

      }
    } else if (this.webUser.isWrongChain) {
      console.log('Wr0ng chain!');
      //this._requestAddOrChangeNetwork();
      // Post message to user popap.
      /**
       * this._instance.window.ethereum
          .request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: environment.NETWORK.chainId,
                chainName: environment.NETWORK.chainName,
                nativeCurrency: environment.NETWORK.nativeCurrency,
                rpcUrls: environment.NETWORK.rpcUrls,
                blockExplorerUrls: environment.NETWORK.blockExplorerUrls,
              },
            ],
          })
          .catch((error: any) => {
            console.log(error);
          });
       */
    }
  }

  private async __requestAddressAndBalance() {
    const _accounts = await this.csxInstance.window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    this.webUser.address = _accounts[0];

    console.log('gg?');

    await this.___getTrimmedAddress();
    await this.___initContractInstances();
    await this.___initUserBalances();    
    await this.___notifyUserWalletConnected();

    this.csxInstance.accountSubject.next(this.webUser.address);
  }

  private async ___getTrimmedAddress() {
    const account = this.webUser.address!;
    const length = account.length;
    const first6 = account.toString().substring(length - length, 6);
    const last4 = account.toString().substring(length - 4, length);
    this.webUser.shortAddy = first6 + '...' + last4;
  }

  // private async ___requestUserEthBalance() {
  //   this.webUser.balances!['ETH'].balanceEth = parseFloat(
  //     Web3.utils.fromWei(
  //       await this.csxInstance.window.web3.eth.getBalance(this.webUser.address),
  //       'ether'
  //     )
  //   ).toFixed(4);
  // }

  private async ___initContractInstances() {
    this.csxInstance.tradeFactory =
      await new this.csxInstance.window.web3.eth.Contract(
        environment.CONTRACTS.tradeFactory.abi as AbiItem[],
        environment.CONTRACTS.tradeFactory.address,
        { from: this.webUser.address }
      );

    this.csxInstance.usersContract =
      await new this.csxInstance.window.web3.eth.Contract(
        environment.CONTRACTS.Users.abi as AbiItem[],
        environment.CONTRACTS.Users.address,
        { from: this.webUser.address }
      );

    this.csxInstance.CSXToken =
      await new this.csxInstance.window.web3.eth.Contract(
        environment.CONTRACTS.CSXToken.abi as AbiItem[],
        environment.CONTRACTS.CSXToken.address,
        { from: this.webUser.address }
      );

    this.csxInstance.sCSXToken =
      await new this.csxInstance.window.web3.eth.Contract(
        environment.CONTRACTS.StakedCSX.abi as AbiItem[],
        environment.CONTRACTS.StakedCSX.address,
        { from: this.webUser.address }
      );

    this.csxInstance.eCSXToken =
      await new this.csxInstance.window.web3.eth.Contract(
        environment.CONTRACTS.EscrowedCSX.abi as AbiItem[],
        environment.CONTRACTS.EscrowedCSX.address,
        { from: this.webUser.address }
      );

    this.csxInstance.vCSXToken =
      await new this.csxInstance.window.web3.eth.Contract(
        environment.CONTRACTS.VestedCSX.abi as AbiItem[],
        environment.CONTRACTS.VestedCSX.address,
        { from: this.webUser.address }
      );

    this.csxInstance.WETHToken =
      await new this.csxInstance.window.web3.eth.Contract(
        environment.CONTRACTS.Currencies.abi as AbiItem[],
        environment.CONTRACTS.Currencies.addresses.WETH,
        { from: this.webUser.address }
      );

    this.csxInstance.USDTToken =
      await new this.csxInstance.window.web3.eth.Contract(
        environment.CONTRACTS.Currencies.abi as AbiItem[],
        environment.CONTRACTS.Currencies.addresses.USDT,
        { from: this.webUser.address }
      );

    this.csxInstance.USDCToken =
      await new this.csxInstance.window.web3.eth.Contract(
        environment.CONTRACTS.Currencies.abi as AbiItem[],
        environment.CONTRACTS.Currencies.addresses.USDC,
        { from: this.webUser.address }
      );

    this._subscribeToTradeFactoryEvents();
  }

  private async ___notifyUserWalletConnected() {
    console.log('NOTIFYING', this.webUser.shortAddy);

    this.webUser.isUserWalletConnected = true;
    const uri = 'https://arbiscan.io/address/' + this.webUser.address;
    this.notificationsService.notify(
      `Wallet Connected `,
      uri,
      this.webUser.shortAddy
    );
  }

  private async _requestAddOrChangeNetwork() {
    try {
      await this.csxInstance.window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: environment.NETWORK.chainId }],
      });
      this.webUser.isWrongChain = false;
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await this.csxInstance.window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: environment.NETWORK.chainId,
                chainName: environment.NETWORK.chainName,
                nativeCurrency: environment.NETWORK.nativeCurrency,
                rpcUrls: environment.NETWORK.rpcUrls,
                blockExplorerUrls: environment.NETWORK.blockExplorerUrls,
              },
            ],
          });
        } catch (addError) {
          // handle "add" error
          console.log('Coudlnt add error', addError);
        }
      }
      // handle other "switch" errors
    }
  }

  private async ___initUserBalances() {

    this.webUser.balances!['ETH'].balanceWei = await this.csxInstance.window.web3.eth.getBalance(
      this.webUser.address
    );

    this.webUser.balances!['ETH'].balanceEth = parseFloat(
      Web3.utils.fromWei(
        this.webUser.balances!['ETH'].balanceWei,
        'ether'
      )
    ).toFixed(4);

    this.webUser.balances!['CSX'].balanceWei = await this.csxInstance.CSXToken.methods
      .balanceOf(this.webUser.address)
      .call();

    this.webUser.balances!['CSX'].balanceEth = parseFloat(
      Web3.utils.fromWei(
        this.webUser.balances!['CSX'].balanceWei,
        'ether'
      )
    ).toFixed(4);

    this.webUser.balances!['sCSX'].balanceWei = await this.csxInstance.sCSXToken.methods
      .balanceOf(this.webUser.address)
      .call();

    this.webUser.balances!['sCSX'].balanceEth = parseFloat(
      Web3.utils.fromWei(
        this.webUser.balances!['sCSX'].balanceWei,
        'ether'
      )
    ).toFixed(4);

    this.webUser.balances!['eCSX'].balanceWei = await this.csxInstance.eCSXToken.methods
      .balanceOf(this.webUser.address)
      .call();

    this.webUser.balances!['eCSX'].balanceEth = parseFloat(
      Web3.utils.fromWei(
        this.webUser.balances!['eCSX'].balanceWei,
        'ether'
      )
    ).toFixed(4);

    this.webUser.balances!['vCSX'].balanceWei = await this.csxInstance.vCSXToken.methods
      .balanceOf(this.webUser.address)
      .call();

    this.webUser.balances!['vCSX'].balanceEth = parseFloat(
      Web3.utils.fromWei(
        this.webUser.balances!['vCSX'].balanceWei,
        'ether'
      )
    ).toFixed(4);

    this.webUser.balances!['WETH'].balanceWei = await this.csxInstance.WETHToken.methods
      .balanceOf(this.webUser.address)
      .call();

    this.webUser.balances!['WETH'].balanceEth = parseFloat(
      Web3.utils.fromWei(
        this.webUser.balances!['WETH'].balanceWei,
        'ether'
      )
    ).toFixed(4);

    this.webUser.balances!['USDT'].balanceWei = await this.csxInstance.USDTToken.methods
      .balanceOf(this.webUser.address)
      .call();

      const decimals = 6;
      const tenPowerDecimals = Web3.utils.toBN(10).pow(Web3.utils.toBN(decimals));

      const usdtBalanceBN = Web3.utils.toBN(this.webUser.balances!['USDT'].balanceWei);
      const usdtBalanceInteger = usdtBalanceBN.div(tenPowerDecimals).toString(10);
      const usdtBalanceFraction = usdtBalanceBN.mod(tenPowerDecimals).toString(10).padStart(decimals, '0');

      this.webUser.balances!['USDT'].balanceEth = parseFloat(`${usdtBalanceInteger}.${usdtBalanceFraction}`).toFixed(2);

    this.webUser.balances!['USDC'].balanceWei = await this.csxInstance.USDCToken.methods
      .balanceOf(this.webUser.address)
      .call();

      const usdcBalanceBN = Web3.utils.toBN(this.webUser.balances!['USDC'].balanceWei);
      const usdcBalanceInteger = usdcBalanceBN.div(tenPowerDecimals).toString(10);
      const usdcBalanceFraction = usdcBalanceBN.mod(tenPowerDecimals).toString(10).padStart(decimals, '0');

      this.webUser.balances!['USDC'].balanceEth = parseFloat(`${usdcBalanceInteger}.${usdcBalanceFraction}`).toFixed(2);
  }

  /**
   * Generic function to modify balance locally
   */

  //this.increaseBalance('ETH', '1');
  public increaseBalance(token: string, increaseAmount: string) {
    const decimals = this._getTokenDecimals(token);
    const currentBalanceBN = Web3.utils.toBN(this.webUser.balances![token].balanceWei);
    const increaseAmountBN = Web3.utils.toBN(Web3.utils.toWei(increaseAmount, 'ether'));
    const newBalanceBN = currentBalanceBN.add(increaseAmountBN);

    this.webUser.balances![token].balanceWei = newBalanceBN.toString();

    const fixedValue = decimals === 18 ? 4 : 2;

    this.webUser.balances![token].balanceEth =
      parseFloat(
        this._fromWeiWithDecimals(this.webUser.balances![token].balanceWei, decimals)
      ).toFixed(fixedValue);
  }

  //this.decreaseBalance('ETH', '1');
  public decreaseBalance(token: string, decreaseAmount: string) {
    const decimals = this._getTokenDecimals(token);
    const currentBalanceBN = Web3.utils.toBN(this.webUser.balances![token].balanceWei);
    const decreaseAmountBN = Web3.utils.toBN(Web3.utils.toWei(decreaseAmount, 'ether'));
    const newBalanceBN = currentBalanceBN.sub(decreaseAmountBN);
  
    if (newBalanceBN.isNeg()) {
      throw new Error('Insufficient local balance');
    }
  
    this.webUser.balances![token].balanceWei = newBalanceBN.toString();

    const fixedValue = decimals === 18 ? 4 : 2;

    this.webUser.balances![token].balanceEth = 
      parseFloat(
        this._fromWeiWithDecimals(this.webUser.balances![token].balanceWei, decimals)
      ).toFixed(fixedValue);
  }

  private _getTokenDecimals(token: string): number {
    switch (token) {
      case 'USDC':
      case 'USDT':
        return 6;
      default:
        return 18; // Most tokens including ETH and WETH have 18 decimal places
    }
  }

  private _fromWeiWithDecimals(amount: string, decimals: number): string {
    const tenPowerDecimals = Web3.utils.toBN(10).pow(Web3.utils.toBN(decimals));
    const amountBN = Web3.utils.toBN(amount);
    const integerPart = amountBN.div(tenPowerDecimals).toString(10);
    const fractionalPart = amountBN.mod(tenPowerDecimals).toString(10).padStart(decimals, '0');
    return `${integerPart}.${fractionalPart}`;
  }

  /**
   * Used in frame/nav-bar
   */
  public requestUserSwitchToCorrectNetwork() {
    this._requestAddOrChangeNetwork();
  }

  public getTrimmedAddress(address: string): string {
    const account = address;
    const length = account.length;
    const first6 = account.toString().substring(length - length, 6);
    const last4 = account.toString().substring(length - 4, length);
    return first6 + '...' + last4;
  }

  public async updateBalance() {
    try {
      await this.__requestAddressAndBalance();
    } catch (error) {
      console.log('updateBalance error!', error);
    }
  }

  /**
   * Used in components/list-item
   * this.itemData.full_item_name, tradeLink, this.tempAssetId, itemInspectLink, this.exactImage, weiPrice
   */
  public listItem(
    //   _itemHashName: string,
    //   _tradeUrl: string,
    //   _assetId: string,
    //   _inspectLink: string,
    //   _itemImageUrl: string,
    //   _weiPrice: string,
    //   _floatVal: string,
    //   _floatMin: string,
    //   _floatMax: string,
    //   _stickers: any[],
    //   _weaponType: string
    // ) {
    //   const FloatInfo = {
    //     value: _floatVal,
    //     min: _floatMin,
    //     max: _floatMax,
    //   };
    _itemHashName: string,
    _tradeUrl: string,
    _assetId: string,
    _inspectLink: string,
    _itemImageUrl: string,
    _weiPrice: string,
    _floatVal: string,
    _floatMin: string,
    _floatMax: string,
    _paintSeed: string,
    _paintIndex: string,
    _stickers: any[],
    _weaponType: string
  ) {
    const floatInfoString = `[${_floatMax}, ${_floatMin}, ${_floatVal}]`;

    const SkinInfo = {
      floatValues: floatInfoString,
      paintSeed: _paintSeed,
      paintIndex: _paintIndex,
    };

    const url = _tradeUrl;
    if (this.isValidUrl(url)) {
      const params = new URLSearchParams(new URL(url).search);
      const partnerId = params.get('partner');
      const token = params.get('token');
      const TradeUrl = {
        partner: partnerId,
        token: token,
      };

      console.log('TRADE', TradeUrl);

      this.csxInstance.tradeFactory.methods
        .createListingContract(
          _itemHashName,
          TradeUrl,
          _assetId,
          _inspectLink,
          _itemImageUrl,
          _weiPrice,
          SkinInfo,
          _stickers,
          _weaponType
        )
        .send({ from: this.webUser.address })
        .then((receipt: any) => {
          console.log('TX receipt', receipt);
          //return false;
        })
        .catch((error: any) => {
          console.log('TX error', error);
          //return false;
        });
    }
  }

  /**
   * Used in components/recently-listed-items
   */

  handleError(error: any) {
    switch (error.code) {
      case -32000:
        this.notificationsService.openSnackBar(
          'RPC error, you might need to refresh site or change RPC endpoint in wallet.',
          'OK'
        );
        break;
      default:
        this.notificationsService.openSnackBar(
          'Error, you might need to refresh site or change RPC endpoint in wallet.',
          'OK'
        );
        break;
    }
  }

  async getTradeDetailsByIndex(_index: number): Promise<any> {
    try {
      let tradeDetails = await this.csxInstance.tradeFactory.methods
        .getTradeDetailsByIndex(_index)
        .call({ from: this.webUser.address });

      const etherPrice = this.fromWei(tradeDetails.weiPrice);
      const trimmedAddress = this.getTrimmedAddress(
        tradeDetails.contractAddress
      );

      const sellerTrimmedAddress = this.getTrimmedAddress(
        tradeDetails.seller
      );

      tradeDetails = { ...tradeDetails, etherPrice, trimmedAddress, sellerTrimmedAddress };
      return tradeDetails;
    } catch (error: any) {
      this.handleError(error);
    }
  }

  async getTradeCountByStatus(status: TradeStatus): Promise<number> {
    return await this.csxInstance.tradeFactory.methods
      .getTradeCountByStatus(status)
      .call({ from: this.webUser.address });
  }

  async getTradeIndexesByStatus(
    _status: TradeStatus,
    _from: number,
    _maxResults: number
  ): Promise<[any, any]> {
    if (_maxResults == 0) {
      //_maxResults = await this.getTotalContracts();
      _maxResults = await this.getTradeCountByStatus(_status);
    }
    let tradeIndexes = await this.csxInstance.tradeFactory.methods
      .getTradeIndexesByStatus(_status, _from, _maxResults)
      .call({ from: this.webUser.address });

    const ETHUSD = await this.getEthPrice();

    tradeIndexes = tradeIndexes.map((element: any) => {
      // Create a new object with the original element's properties and the extra variable
      const etherPrice = this.fromWei(element.weiPrice);
      const priceInUSD = ETHUSD * parseFloat(etherPrice);
      return {
        ...element,
        etherPrice: etherPrice,
        priceInUSD: priceInUSD,
      };
    });

    return [tradeIndexes, _maxResults];
  }

  public async BuyItem(
    itemAddress: string,
    buyerTradeUrl: string,
    refCode: string,
    weiPrice: string
  ) {
    if (this.isValidUrl(buyerTradeUrl)) {
      const params = new URLSearchParams(new URL(buyerTradeUrl).search);
      const partnerId = params.get('partner');
      const token = params.get('token');
      const TradeUrl = {
        partner: partnerId,
        token: token,
      };

      const contractInstance =
        await new this.csxInstance.window.web3.eth.Contract(
          environment.CONTRACTS.tradeContract.abi as AbiItem[],
          itemAddress,
          { from: this.webUser.address }
        );

      contractInstance.methods
        .commitBuy(TradeUrl, refCode)
        .send({ from: this.webUser.address, value: weiPrice })
        .then((receipt: any) => {
          console.log('TX receipt', receipt);
          //return false;
        })
        .catch((error: any) => {
          console.log('TX error', error);
          //return false;
        });
    }
  }

  /**
   * Used in components/my-trades:
   * getUserTotalTradeUIs
   */

  public async cancelTrade(contractAddress: string, isBuyer: boolean): Promise<boolean> {
    try {
      const contractInstance = await new this.csxInstance.window.web3.eth.Contract(
        environment.CONTRACTS.tradeContract.abi as AbiItem[],
        contractAddress,
        { from: this.webUser.address }
      );

      if (isBuyer) {
        return contractInstance.methods
          .buyerCancel()
          .send({ from: this.webUser.address })
          .then((receipt: any) => {
            console.log('TX receipt', receipt);
            return true;
          });
      } else {
        return contractInstance.methods
          .sellerCancel()
          .send({ from: this.webUser.address })
          .then((receipt: any) => {
            console.log('TX receipt', receipt);
            return true;
          });
      }
    } catch (error: any) {
      this.handleError(error);
      return false;
    }

  }

  public async sellerTradeVeridict(contractAddress: string, sellerCommited: boolean): Promise<boolean> {
    try {
      const contractInstance = await new this.csxInstance.window.web3.eth.Contract(
        environment.CONTRACTS.tradeContract.abi as AbiItem[],
        contractAddress,
        { from: this.webUser.address }
      );

      return contractInstance.methods
        .sellerTradeVeridict(sellerCommited)
        .send({ from: this.webUser.address })
        .then((receipt: any) => {
          console.log('TX receipt', receipt);
          return true;
        });
    } catch (error) {
      console.error(error)
      return false;
    }

  }

  public async getVariableFromTradeContract(address: string, variable: string) {
    const contractInstance = await new this.csxInstance.window.web3.eth.Contract(
      environment.CONTRACTS.tradeContract.abi as AbiItem[],
      address,
      { from: this.webUser.address }
    );

    return await contractInstance.methods[variable]().call();
  }

  async getTradeDetailsByAddress(_address: string): Promise<any> {
    try {
      let tradeDetails = await this.csxInstance.tradeFactory.methods
        .getTradeDetailsByAddress(_address)
        .call({ from: this.webUser.address });

      const etherPrice = this.fromWei(tradeDetails.weiPrice);
      const trimmedAddress = this.getTrimmedAddress(
        tradeDetails.contractAddress
      );

      tradeDetails = { ...tradeDetails, etherPrice, trimmedAddress };
      return tradeDetails;
    } catch (error: any) {
      switch (error.code) {
        case -32000:
          this.notificationsService.openSnackBar(
            'RPC error, you might need to refresh site or change RPC endpoint in wallet.',
            'OK'
          );
          break;
        default:
          this.notificationsService.openSnackBar(
            'Error, you might need to refresh site or change RPC endpoint in wallet.',
            'OK'
          );
          break;
      }
    }
  }

  async getUserTotalTradeUIs(): Promise<number> {
    const total = await this.csxInstance.usersContract.methods
      .getUserTotalTradeUIs(this.webUser.address)
      .call({ from: this.webUser.address });
    console.log('getUserTotalTradeUIs', total);

    return total;
  }

  async getUserTradeUIByIndex(_index: number) {
    const tradeUI = await this.csxInstance.usersContract.methods
      .getUserTradeUIByIndex(this.webUser.address, _index)
      .call({ from: this.webUser.address });
    return tradeUI;
  }

  async isThisTradeContract(_address: string): Promise<boolean> {
    const isTradeContract = await this.csxInstance.tradeFactory.methods
      .isThisTradeContract(_address)
      .call({ from: this.webUser.address });
    return isTradeContract;
  }

  /**
   * Level Circle
   */
  public async getProfileLevel(address: string) {
    const contractInstance = await new this.csxInstance.window.web3.eth.Contract(
      environment.CONTRACTS.UserProfileLevel.abi as AbiItem[],
      environment.CONTRACTS.UserProfileLevel.address,
      { from: this.webUser.address }
    );

    return await contractInstance.methods.getUserLevel(address).call();
  }

  async getUserDataFromUsers(address: string) {
    const tradeUI = await this.csxInstance.usersContract.methods
      .getUserData(address)
      .call({ from: this.webUser.address });
    return tradeUI;
  }

  async getUserDataFromProfileLevel(address: string) {
    const contractInstance = await new this.csxInstance.window.web3.eth.Contract(
      environment.CONTRACTS.UserProfileLevel.abi as AbiItem[],
      environment.CONTRACTS.UserProfileLevel.address,
      { from: this.webUser.address }
    );

    const levels = await contractInstance.methods
      .getUserData(address)
      .call({ from: this.webUser.address });

    return levels;
  }

  async getCostForNextLevels(address: string, newLevels: string) {
    const contractInstance = await new this.csxInstance.window.web3.eth.Contract(
      environment.CONTRACTS.UserProfileLevel.abi as AbiItem[],
      environment.CONTRACTS.UserProfileLevel.address,
      { from: this.webUser.address }
    );

    return await contractInstance.methods
      .getCostForNextLevels(address, newLevels)
      .call({ from: this.webUser.address });
  }

  async approveCSX(spenderAddress: string, tokenAmount: string) {
  const tokenContractInstance = await new this.csxInstance.window.web3.eth.Contract(
    environment.CONTRACTS.CSXToken.abi as AbiItem[],
    environment.CONTRACTS.CSXToken.address,
    { from: this.webUser.address }
  );

  return await tokenContractInstance.methods
    .approve(spenderAddress, tokenAmount)
    .send({ from: this.webUser.address });
 }

  async allowanceCSX(owner: string, spender: string) {
    return await this.csxInstance.CSXToken.methods
      .allowance(owner, spender)
      .call({ from: this.webUser.address });
  }

  async levelUp(CSXTokenWeiAmount: string, newLevels: string) {
    const contractInstance = await new this.csxInstance.window.web3.eth.Contract(
      environment.CONTRACTS.UserProfileLevel.abi as AbiItem[],
      environment.CONTRACTS.UserProfileLevel.address,
      { from: this.webUser.address }
    );

    return await contractInstance.methods
      .levelUp(CSXTokenWeiAmount, newLevels)
      .send({ from: this.webUser.address });
  }

  async levelUpProfileLevel(newLevels: string) {
    console.log('THIS WEB USER', this.webUser.address);
    
    // Figure out how much CSX is needed
    const CSXTokenWeiAmount = await this.getCostForNextLevels(
      this.webUser.address!,
      newLevels
    );

    const contractInstance = await new this.csxInstance.window.web3.eth.Contract(
      environment.CONTRACTS.UserProfileLevel.abi as AbiItem[],
      environment.CONTRACTS.UserProfileLevel.address,
      { from: this.webUser.address }
    );

    // Assuming it's already approved
      
    return await contractInstance.methods
      .levelUp(CSXTokenWeiAmount, newLevels)
      .send({ from: this.webUser.address });
  }

  /**
   * Referral Component
   */

  async getReferralInfo(refCode32: string) {
    const contractInstance = await new this.csxInstance.window.web3.eth.Contract(
      environment.CONTRACTS.ReferralRegistry.abi as AbiItem[],
      environment.CONTRACTS.ReferralRegistry.address,
      { from: this.webUser.address }
    );

    return await contractInstance.methods
      .getReferralInfo(refCode32)
      .call({ from: this.webUser.address });
  }


  /**
   * Stake Component
   */

  // Approve CSXToken first
  async stake(amount: string): Promise<string> {
    return await this.csxInstance.sCSXToken.methods.stake(amount).send({ from: this.webUser.address });
  }

  async unstake(amount: string): Promise<string> {
    return await this.csxInstance.sCSXToken.methods.unStake(amount).send({ from: this.webUser.address });
  }

  async claim(claimUsdc: boolean, claimUsdt: boolean, claimWeth: boolean, convertWethToEth: boolean): Promise<string> {
    return await this.csxInstance.sCSXToken.methods.claim(claimUsdc, claimUsdt, claimWeth, convertWethToEth).send({ from: this.webUser.address });
  }

  async getClaimableAmount(): Promise<any> {
    return await this.csxInstance.sCSXToken.methods.getClaimableAmount(this.webUser.address).call({ from: this.webUser.address });
  }

  /**
   * Committed Dialog
   */
  async subscribeToOracleConfirmation() {
    const oracleAddress = await this.getKeeperOracleAddress();
    const options = {
      filter: {
        // event name
        event: 'MyEvent',

        // contract address that emitted the event
        address: '0x9876543210abcdef9876543210abcdef98765432',
      },
      // start block (optional)
      fromBlock: 0,
    };
    this.csxInstance.tradeFactory.events.TradeContractStatusChange(
      options,
      (error: any, event: any) => {
        if (!error) {
          console.log(event.returnValues);
        }
        console.log('event', event);
      }
    );
  }

  /**
   * Utils
   */

  public toWei(ethVal: string): string {
    return Web3.utils.toWei(ethVal, 'ether');
  }

  public fromWei(weiVal: string): string {
    return Web3.utils.fromWei(weiVal, 'ether');
  }

  public isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  }

  async getEthPrice(): Promise<number> {
    if (environment.CONTRACTS.priceFeed.isUsing) {
      const contractInstance =
        await new this.csxInstance.window.web3.eth.Contract(
          environment.CONTRACTS.priceFeed.abi as AbiItem[],
          environment.CONTRACTS.priceFeed.address,
          { from: this.webUser.address }
        );

      const res = await contractInstance.methods
        .latestRoundData()
        .call({ from: this.webUser.address });

      const ethPrice = parseInt(res.answer) / 100000000;

      return ethPrice;
    } else {
      return environment.CONTRACTS.priceFeed.ethMockPrice;
    }
  }

  async getKeeperOracleAddress(): Promise<string> {
    const contractInstance = await new this.csxInstance.window.web3.eth.Contract(
      environment.CONTRACTS.Keepers.abi as AbiItem[],
      environment.CONTRACTS.Keepers.address,
      { from: this.webUser.address }
    );

    const keeperOracleAddress = await contractInstance.methods
      .keeperNodeAddress()
      .call({ from: this.webUser.address });

    return keeperOracleAddress;
  }

  private _subscribeToTradeFactoryEvents() {
    this.csxInstance.tradeFactory.events
      .TradeContractStatusChange()
      .on('data', (event: { returnValues: any }) => {
        this.chainEvents.onEvent(event.returnValues);
      })
      .on('error', (error: any) => {
        this.chainEvents.onError(error);
      });
    this._checkForNewNotifications();
  }

  private async _checkForNewNotifications() {
    const currentBlock = await this.csxInstance.window.web3.eth.getBlockNumber();

    const fromBlock = currentBlock - 50; // Replace 1000 with the desired range

    this.csxInstance.tradeFactory.getPastEvents(
      'TradeContractStatusChange',
      {
        fromBlock: fromBlock,
        toBlock: 'latest',
      },
      (error: any, _pastEvents: any[]) => {
        if (error) {
          console.error('Error getting past events:', error);
        } else {
          // if this.webUser.address is either seller or buyer, make a const array of events
          const myPastEvents = _pastEvents.filter((event) => {
            return (
              event.returnValues.sellerAddress.toLowerCase() == this.webUser.address?.toLowerCase() ||
              event.returnValues.buyerAddress.toLowerCase() == this.webUser.address?.toLowerCase()
            );
          });

          myPastEvents.forEach((event) => {
            //console.log('MAIN EVENT', event);

            //this.chainEvents.onEvent(event.returnValues);
            //console.log('event', event);

            this.collectPastEvent(event.returnValues);
          });
          this.processPastEvents();
        }
      }
    );
  }

  //pastEvents array
  pastEvents: any[] = [];
  collectPastEvent(event: any) {
    // get the event data
    console.log('collectPastEvent', event);

    const contractAddress = event.contractAddress;
    const status = event[1];
    const sellerAddress = event.sellerAddress;
    const buyerAddress = event.buyerAddress;
    const data = event.data;

    // find the index of the event in the array
    const index = this.pastEvents.findIndex(
      (e) => e.contractAddress === contractAddress
    );

    // if the event is not in the array, add it
    if (index === -1) {
      this.pastEvents.push({ contractAddress, status, data, sellerAddress, buyerAddress });
    }

    // if the event is in the array, just update the status.
    if (index > -1) {
      this.pastEvents[index].status = status;
      this.pastEvents[index].data = data;
    }
  }

  processPastEvents() {
    this.pastEvents.forEach((event) => {
      // this.chainEvents.onEvent(event);
      // Push notification
      console.log('hello', event);
      console.log('event.sellerAddress', event.sellerAddress);


      // figure out the role of the user
      const role: TradeRole = event.sellerAddress.toLowerCase() == this.webUser.address?.toLowerCase() ? TradeRole.SELLER : TradeRole.BUYER;

      //Find if it is relevant to notify or not.
      if (event.status == TradeStatus.BuyerCommitted) {
        //Notify
        if (role == TradeRole.BUYER) {

        }

        if (role == TradeRole.SELLER) {
          this.notificationsService.notify('Someone has purchased your AYJTEM', event.contractAddress, 'Check now!', true)
        }

      }
      //If it is relevant, then notify.


    });
  }

  ngOnDestroy(): void { }
}
