export interface Item {
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
    float: floatValues;
    status: string;
    stickers: any[];
    weaponType: string;
    etherPrice: string;
    trimmedAddress: string;
    indexInfo: {
        index: string;
        weiPrice: string;
        priceType: string;
        weaponType: string;
        itemMarketName: string;
        nextIndex: string;
        etherPrice: string;
        priceInUSD: number;
    };
}

interface floatValues {
    max: number;
    min: number;
    value: number;
}