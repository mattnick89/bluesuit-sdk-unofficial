var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { readFile } from "fs";
import fetch from 'node-fetch';
import * as FileApi from 'file-api';
function isUrl(string) {
    var protocolAndDomainRE = /^(?:\w+:)?\/\/(\S+)$/;
    var localhostDomainRE = /^localhost[\:?\d]*(?:[^\:?\d]\S*)?$/;
    var nonLocalhostDomainRE = /^[^\s\.]+\.\S{2,}$/;
    if (typeof string !== 'string') {
        return false;
    }
    var match = string.match(protocolAndDomainRE);
    if (!match) {
        return false;
    }
    var everythingAfterProtocol = match[1];
    if (!everythingAfterProtocol) {
        return false;
    }
    if (localhostDomainRE.test(everythingAfterProtocol) ||
        nonLocalhostDomainRE.test(everythingAfterProtocol)) {
        return true;
    }
    return false;
}
class Documents {
    readFileLocal(document_path) {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            readFile(document_path, (err, data) => {
                let f = new FileApi.File({
                    buffer: data,
                    name: "test.pdf",
                    type: "application/pdf",
                    length: data.length,
                    jsdom: true
                });
                console.log(f);
                if (err) {
                    throw new Error("Unable to access local document");
                }
                return resolve(f);
            });
        }));
    }
    readFileRemote(document_path) {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            fetch(document_path).then((response) => __awaiter(this, void 0, void 0, function* () {
                const body = yield response.arrayBuffer();
                let file = new FileApi.File({
                    buffer: Buffer.from(body),
                    name: "test.pdf",
                    type: "application/pdf",
                    lastModifiedDate: new Date().toISOString(),
                    size: Buffer.from(body).length
                });
                console.log(file);
                return resolve(file);
            }))
                .catch((err) => {
                throw new Error("Unable to access remote document");
            });
        }));
    }
    getDocumentBuffer(document_path) {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            if (typeof document_path == "string") {
                if (document_path.trim() == "") {
                    throw new Error("Invalid document");
                }
            }
            let data_stream;
            if (Buffer.isBuffer(document_path)) {
                return resolve(document_path);
            }
            else {
                if (isUrl(document_path)) {
                    data_stream = yield this.readFileRemote(document_path);
                }
                else {
                    data_stream = yield this.readFileLocal(document_path);
                }
            }
            return resolve(data_stream);
        }));
    }
}
const DocumentsService = new Documents();
export default DocumentsService;
//# sourceMappingURL=documents.service.js.map