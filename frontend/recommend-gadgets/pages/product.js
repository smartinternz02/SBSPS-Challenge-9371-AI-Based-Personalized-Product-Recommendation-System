import React, { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import pstyles from "../styles/Product.module.css";
import { useRouter } from "next/router";
import {
  useProductData,
  useRecommendedProductsData,
} from "../hooks/useProductsHook";
import BounceLoader from "react-spinners/BounceLoader";
import PlaceholderImg from "../images/placeholder.jpg";

const Product = () => {
  let [loading, setLoading] = useState(true);
  let [color, setColor] = useState("#4169E1");
  const [filter, setFilter] = useState(false);

  const [pageNo, setPageNo] = React.useState(1);
  const [limit, setLimit] = React.useState(6);

  const router = useRouter();
  const { productName } = router.query;

  const productsDataOnSuccess = (data) => {
    console.log(
      "Perform side effect after data fetching like setting an alert"
    );
  };

  const productsDataOnError = (error) => {
    console.log(
      "Pefrom side effect on error (like setting an erro) => ",
      error
    );
  };

  console.log("1. productName =>", productName, new Date().toString());

  const {
    isLoading: isProductLoading,
    data: product,
    isError: isProductError,
    error,
    isRefetching: isProductRefetching,
    isRefetchError: isProductRefetchError,
    refetch: refetchProduct,
  } = useProductData(productName, productsDataOnSuccess, productsDataOnError);

  const {
    isLoading: isRecommendationLoading,
    data: rData,
    isError: isRecommendationError,
    error: recommendationError,
    isRefetching: isRecommendationRefetching,
    isRefetchError: isRecommendationRefetchError,
    refetch: refetchRecommendation,
    isFetchingNextPage,
    // "hasNextPage" boolean is now available and is true if "getNextPageParam" returns a value "other" than "undefined"
    hasNextPage,
    fetchNextPage,
  } = useRecommendedProductsData(
    {
      name: productName,
      brand: product?.brand,
      sameBrand: filter,
      limit,
      pageNo,
    },
    productsDataOnSuccess,
    productsDataOnError
  );

  React.useEffect(() => {
    if (!router.isReady) return;
    console.log("productName ===> ", productName);
    if (typeof productName === "string") {
      refetchProduct({ cancelRefetch: false });
    }
  }, [productName]);

  React.useEffect(() => {
    if (!router.isReady) return;
    if (
      typeof productName === "string" &&
      product &&
      typeof product.brand === "string"
    ) {
      refetchRecommendation({ cancelRefetch: false });
    }
  }, [productName, product, filter]);

  const handleCheckbox = (productName, filter) => {
    setFilter(!filter);
  };

  React.useEffect(() => {
    if (pageNo > 1) {
      fetchNextPage();
    }
  }, [pageNo]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Product Page</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        {isProductLoading && (
          <h2>
            <BounceLoader
              color={color}
              loading={loading}
              size={150}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </h2>
        )}

        {isProductRefetching && <h2>Refetching ....</h2>}

        {(isProductError || isProductRefetchError) && (
          <h2>Oops ! An error occurred while loading.</h2>
        )}

        {product && (
          <>
            <div className={pstyles.productbox}>
              <div>
                <img
                  className={pstyles.image}
                  alt="Electronic Gadgets"
                  src={product.picture_url}
                />
              </div>
              <div className={pstyles.productinfo}>
                <div className={pstyles.brand}>{product.brand}</div>

                <div className={pstyles.productname}>
                  {product.product_name}
                </div>

                <div className={pstyles.model}>Model :- {product.model}</div>

                <div className={pstyles.price}>{product.price_inr}</div>

                <div style={{ fontSize: "13px" }}>{product.isInitialData}</div>
              </div>
            </div>
            <div className={pstyles.filterContainer}>
              <div className={pstyles.filterParent}>
                <h2>Recommended Products</h2>
                <div className={pstyles.filterBox}>
                  <input
                    className={pstyles.customCheckbox}
                    type="checkbox"
                    name="checkbox-checked"
                    onChange={() => {
                      setPageNo(1);
                      handleCheckbox(productName, filter);
                    }}
                    checked={filter}
                  />
                  <div
                    style={{ marginTop: "-4px" }}
                    onClick={() => {
                      handleCheckbox(productName, filter);
                    }}
                  >
                    Include Same Brand ({product.brand})
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {!isProductLoading && isRecommendationLoading && (
          <BounceLoader
            color={color}
            loading={loading}
            size={70}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        )}

        {isRecommendationRefetching && (
          <BounceLoader
            color={color}
            loading={loading}
            size={70}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        )}

        {(isRecommendationError || isRecommendationRefetchError) && (
          <h2>Oops ! An error occurred while loading.</h2>
        )}

        {/* {JSON.stringify(rData.pages[0].data)} */}

        <div className={styles.grid}>
          {rData?.pages &&
            rData.pages?.map((group, i) => (
              <React.Fragment key={i}>
                {group.data?.recommended_products?.map((gadget, j) => (
                  <Link
                    key={gadget.id + j}
                    href={{
                      pathname: "/product",
                      query: { productName: gadget.product_name },
                    }}
                  >
                    <div className={styles.card}>
                      <h2>{gadget.brand} &rarr;</h2>
                      <img
                        src={gadget.picture_url}
                        className={pstyles.recommendedImage}
                        alt="Image not found"
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null; // prevents looping
                          currentTarget.src = "../images/placeholder.jpg";
                        }}
                      />

                      <p className={styles.product_name}>
                        {gadget.product_name}.
                      </p>
                    </div>
                  </Link>
                ))}
              </React.Fragment>
            ))}
        </div>
        <div>
          <button
            onClick={() => setPageNo((no) => no + 1)}
            disabled={!hasNextPage || isFetchingNextPage}
          >
            {isFetchingNextPage
              ? "Loading more..."
              : hasNextPage
              ? "Load More"
              : "Nothing more to load"}
          </button>
        </div>
      </main>{" "}
    </div>
  );
};

export default Product;
