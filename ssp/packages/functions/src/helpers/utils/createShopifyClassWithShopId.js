import {getShopDataById} from '@functions/repositories/shopRepository';
import Shopify from 'shopify-api-node';

export async function createShopifyClassWithShopId(shopId) {
  const {accessToken, shopifyDomain} = await getShopDataById(shopId);
  return new Shopify({
    shopName: shopifyDomain,
    accessToken
  });
}
