import { Configuration, AjarnApi } from "./generated";

const config = new Configuration({
  basePath: "http://192.168.1.168:3000",
});

export const ajarnApi = new AjarnApi(config);
