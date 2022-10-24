import axios from "axios";
import {
  useQuery,
  useQueryClient,
  prefetchQuery,
  useInfiniteQuery,
} from "react-query";
// custom request function
import { request } from "../utils/axios-utils";

const fetchProducts = (name, limit, pageNo) => {
  return request({
    url: `/search`,
    method: "POST",
    data: { query: name, limit, pageNo },
  });
};

const fetchProduct = (name) => {
  return request({ url: `/product`, method: "GET", params: { name: name } });
};

const fetchRecommendedProducts = (options) => {
  // options.name, options.sameBrand
  return request({
    url: `/recommend_products`,
    method: "GET",
    params: { ...options },
  });
};

export const useProductsData = (
  { name, limit, pageNo },
  onSuccess,
  onError
) => {
  const queryClient = useQueryClient();

  return useQuery(
    ["products", name, limit, pageNo],
    () => fetchProducts(name, limit, pageNo),
    {
      // 5 mins (read FRONTEND_README). No network request will happen till 5 mins, after initial request.
      staleTime: 1000 * 60 * 5,
      onSuccess,
      onError,
      enabled: false,
      keepPreviousData: true,
      // Method called after successful execution to modify the data.
      // Although the full data will be stored, return only selected keys to be used in the UI
      select: (data) => {
        let tData = { hasMore: data.data?.hasMore, productsData: [] };
        const productsData = data.data?.products.map((product) => {
          return {
            id: product.id,
            picture_url: product.picture_url,
            product_name: product.product_name,
            brand: product.brand,
          };
        });
        tData.productsData = productsData;
        return tData;
      },
    }
  );
};

export const useProductData = (name, onSuccess, onError) => {
  const queryClient = useQueryClient();

  return useQuery(["product", name], () => fetchProduct(name), {
    // NOTE :- If the QUERY KEY ["product", name] IS NOT THERE IN THE CACHE "BEFOREHAND (we haven't visited that route yet)" "WE NEED TO FETCH THE DATA ANYWAY"

    // BUT IF THE QUERY KEY ["product", name] IS IN THE CACHE & the STALETIME HAS NOT BEEN EXCEEDED, THEN IT WILL GIVE DATA FROM CACHE.
    staleTime: 30 * 1000,
    onSuccess,
    onError,
    enabled: true,
    select: (data) => {
      return data.data;
    },
  });
};

export const useRecommendedProductsData = (options, onSuccess, onError) => {
  return useInfiniteQuery(
    ["recommended_products"],
    () => fetchRecommendedProducts(options),
    {
      staleTime: 1000 * 60 * 5,
      onSuccess,
      onError,
      // To prevent it from automatically running
      enabled: false,
      getNextPageParam: (lastPage, pages) => {
        // console.log("===> getNextPageParam");
        // console.log(lastPage);
        return lastPage.data?.hasMore;
      },
    }
  );
};
