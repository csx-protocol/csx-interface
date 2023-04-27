export interface MyTradeItem {
    contractAddress: string;
    seller: string;
    sellerTradeUrl: [partner: string, token: string];
    buyer: string;
    buyerTradeUrl: [partner: string, token: string];
    itemMarketName: string;
    inspectLink: string;
    itemImageUrl: string;
    weiPrice: string;
    averageSellerDeliveryTime: string;
    float: FloatValues;
    status: string;
    stickers: Sticker[];
    weaponType: string;
    etherPrice: string;
    trimmedAddress: string;
    uiInfo: UiInfo;
  }
  
  interface Sticker {
    name: string;
    category: string;
    index: string;
    imageUrl: string;
  }
  
  interface UiInfo {
    contractAddress: string;
    role: string;
    status: string;
  }

  interface FloatValues {
    max: number;
    min: number;
    value: number;
  }