import { readFile } from "fs";
import fetch from 'node-fetch';

function isUrl(string: string){
    var protocolAndDomainRE = /^(?:\w+:)?\/\/(\S+)$/;
    var localhostDomainRE = /^localhost[\:?\d]*(?:[^\:?\d]\S*)?$/
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

    private readFileLocal(document_path: string): Promise<Buffer> {
        return new Promise(async (resolve)=>{
            readFile(document_path, (err, data: Buffer)=>{
                if(err){ throw new Error("Unable to access local document") }
                return resolve(data)
            });
        })
    }

    private readFileRemote(document_path: string): Promise<Buffer> {
        return new Promise(async (resolve)=>{
            fetch(document_path).then(async (response: any)=>{
                const body: ArrayBuffer = await response.arrayBuffer();               
                return resolve(Buffer.from(body))
            })
            .catch((err)=>{
                throw new Error("Unable to access remote document");
            })
        })
    }
    
    public getDocumentBuffer(document_path: string | Buffer): Promise<Buffer> {
        return new Promise(async (resolve)=>{
            if(typeof document_path == "string"){
                if(document_path.trim() == ""){ throw new Error("Invalid document") }
            }

            let data_stream: Buffer;

            if(Buffer.isBuffer(document_path)){
                return resolve(document_path as Buffer);
            }else{
                if(isUrl(document_path as string)){
                    data_stream = await this.readFileRemote(document_path as string);
                }else{
                    data_stream = await this.readFileLocal(document_path as string);
                }
            }

            return resolve(data_stream as Buffer)
        })
    }

}
const DocumentsService: Documents = new Documents();
export default DocumentsService;