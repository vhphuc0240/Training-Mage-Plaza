import axios from 'axios';

export async function makeRequest({url}) {
  const shopDomain = Shopify.shop;

  const {data} = await axios.get(url, {
    params: {
      shopDomain
    }
  });
  return data.data;
}
