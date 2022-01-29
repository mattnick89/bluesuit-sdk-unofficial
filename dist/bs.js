var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Configure } from './services/config.service.js';
import { Http } from "./services/http.service.js";
import DocumentsService from "./services/documents.service.js";
import axios from "axios";
/**
 * @module BlueSuitSDK
 */
/**
 * @class
 */
export default class BlueSuitSDK {
    /**
     * @constructor
     * @param {string} apiKey
     */
    constructor(apiKey) {
        this._http = Http;
        if (apiKey.trim() == "") {
            throw new Error("Invalid API Key");
        }
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
     * @param { string | Buffer } document_path Pass a relative path to a file, a url to a hosted file, or a binary stream of a file.
    * @param {('closing_disclosure'|'property_deed'|'rent_roll'|'purchase_sale_agreement'|'offering_memo')} document_type
    * @param {('accurate'|'quick'|'foundational')} processing_type
    * @param {ProcessOptions} options
    * @returns {Promise<ProcessFile>}
    */
    processDocument(document_path, document_type, processing_type, options = {}) {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            if (document_type != "psa" && processing_type == "foundational") {
                throw new Error("Foundational processing is only available for Purchase and Sale Agreement documents");
            }
            const document_buffer = yield DocumentsService.getDocumentBuffer(document_path);
            let query_string = "";
            if (options.email && options.email.length > 0) {
                options.email = options.email.map((eml) => eml.trim().toLowerCase());
                query_string += "?email=" + options.email.join(',');
            }
            if (options.tag) {
                if (query_string == "") {
                    query_string += "?";
                }
                else {
                    query_string += "&";
                }
                query_string += "tag=" + options.tag;
            }
            axios({
                method: "post",
                url: this._config.getApiBasePath() + document_path + "/" + processing_type + query_string,
                data: document_buffer
            }).then((res) => {
                let response = {
                    message: res.data.message,
                    requestId: res.data.requestId
                };
                return resolve(response);
            }).catch((err) => {
                return resolve({
                    message: "Unable to process document"
                });
            });
        }));
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
    checkStatus(requestId) {
        return new Promise((resolve) => {
            axios({
                method: "get",
                url: this._config.getApiBasePath() + "status?requestId=" + requestId,
            }).then((res) => {
                let response = {
                    message: res.data.message,
                    requestId: res.data.requestId
                };
                if (res.status == 202 && res.headers['Location']) {
                    response.location = res.headers['Location'];
                }
                return resolve(response);
            }).catch((err) => {
                return resolve({
                    message: "No process found with provided requestId",
                    requestId: requestId
                });
            });
        });
    }
}
//# sourceMappingURL=bs.js.map