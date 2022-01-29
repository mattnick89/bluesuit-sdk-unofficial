import axios from "axios";
import { Configure, ConfigService } from "./config.service.js";

class HttpClient {
    
    private _config: ConfigService;

    constructor(){
        this._config = Configure;
    }

    public getApi(path: string){
        return new Promise(async (resolve)=>{
            axios({
                method: "get",
                url: this._config.getApiBasePath()+path,
                headers: {
                    "x-api-key": this._config.getApiKey()
                }
            }).then((resp: any)=>resolve({error: null, res: resp.data}))
            .catch((err:any)=>resolve({error: err.data}))
        })
    }

    public postApi(path: string){
        return new Promise(async (resolve)=>{
            axios({
                method: "get",
                url: this._config.getApiBasePath()+path,
                headers: {
                    "x-api-key": this._config.getApiKey()
                }
            }).then((resp: any)=>resolve({error: null, res: resp.data}))
            .catch((err:any)=>resolve({error: err.data}))
        })
    }
}

const Http = new HttpClient();

export { Http, HttpClient };