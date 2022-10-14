import axios from "axios";
import { API } from "../nconfig";

const client = axios.create({ baseURL: API });

// function that wraps all Axios request
export const request = ({ ...options }) => {
  client.defaults.headers.common.Authorization = `Bearer token`;

  const onSuccess = (response) => response;

  const onError = (error) => {
    // optionally catch errors & add additional logging here
    // we can perform redirects & all here
    return error;
  };

  return client(options).then(onSuccess).catch(onError);
};
