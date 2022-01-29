import { CheckStatusResponse, DocumentType, ProccessingResponse, ProcessingOptions, ProcessingType } from "./interfaces/main.interface.js";
import { Configure, ConfigService} from './services/config.service.js';
import { Http, HttpClient } from "./services/http.service.js";
import DocumentsService from "./services/documents.service.js";
import axios, { AxiosResponse } from "axios";

/**
 * @module BlueSuitSDK
 * @class
 */
export default class BlueSuitSDK {
    
    /**
    * @private
    */
    private _config: ConfigService;
    private _http: HttpClient = Http;
    
    /**
    * @constructor
    * @param {string} apiKey
    */
    constructor(apiKey: string){
        if(apiKey.trim() == ""){ throw new Error("Invalid API Key") }
        this._config = Configure;
        this._config.setApiKey(apiKey);
    }

    /**
    * @typedef ProcessFile
    * @property {string} requestId
    * @property {string} message
    */

    /**
    * @typedef ProcessOptions
    * @property {string} tag
    * @property {string[]} email
    */

    /**
    * @function
    * @name processDocument
    * @description Describes the document type and process type you would like use when submitting your document.
    * @param { string | Buffer } document_path Pass a file path, a url to a hosted file, or a binary stream of a file.
    * @param {('closing_disclosure'|'property_deed'|'rent_roll'|'purchase_sale_agreement'|'offering_memo')} document_type
    * @param {('accurate'|'quick'|'foundational')} processing_type
    * @param {ProcessOptions} options
    * @returns {Promise<ProcessFile>}
    */
    public processDocument(document_path: string | Buffer, document_type: DocumentType, processing_type: ProcessingType, options: ProcessingOptions = {}): Promise<ProccessingResponse> {
        return new Promise(async (resolve)=>{
            if(document_type != "psa" && processing_type == "foundational"){
                throw new Error("Foundational processing is only available for Purchase and Sale Agreement type documents.");
            }
            const document_buffer: any = await DocumentsService.getDocumentBuffer(document_path);
            
            let query_string: string = "";
            if(options.email && options.email.length > 0){
                options.email = options.email.map((eml:string)=>eml.trim().toLowerCase());
                query_string += "?email="+options.email.join(',');
            }
            if(options.tag){
                if(query_string == ""){ query_string += "?"; }
                else{ query_string += "&" }
                query_string += "tag="+options.tag
            }

            axios({
                method: "post",
                url: this._config.getApiBasePath()+document_type+"/"+processing_type+query_string,
                data: document_buffer,
                headers: {
                    "Content-Type": "application/pdf",
                    "x-api-key": this._config.getApiKey()
                }
            }).then((res: any)=>{
                let response: ProccessingResponse = {
                    message: res.data.message,
                    requestId: res.data.requestId
                }
                return resolve(response)
            }).catch((err)=>{
                return resolve({
                    message: "Unable to process document"
                })
            })

        })
    }

    /**
     * @typedef CheckStatusResponse
     * @property {string} message
     * @property {string} requestId
     * @property {string} location
     */

    /**
     * @function
     * @name checkStatus
     * @description Function returns document processing statues
     * @param {string} requestId
     * @returns { Promise<CheckStatusResponse> }
    */
    public checkStatus(requestId: string): Promise<CheckStatusResponse> {
        return new Promise((resolve)=>{
            axios({
                method: "get",
                url: this._config.getApiBasePath()+"status?requestId="+requestId,
                headers: {
                    "x-api-key": this._config.getApiKey()
                }
            }).then((res: AxiosResponse)=>{
                let response: CheckStatusResponse = {
                    message: res.data.message,
                    requestId: res.data.requestId
                }
                if(res.status == 202 && res.headers['Location']){
                    response.location = res.headers['Location'];
                }
                return resolve(response)
            }).catch((err)=>{
                return resolve({
                    message: "No process found with provided requestId",
                    requestId: requestId
                })
            })
        })
    }
}