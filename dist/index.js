import {BlueSuitSDK} from './main.js';
const bs = new BlueSuitSDK("xxx");
async function test() {
    const document = await bs.processDocument(
        "https://www.americanexpress.com/content/dam/amex/us/staticassets/pdf/GCO/Test_PDF.pdf",
        "closing_disclosure",
        "accurate",
        {
            email: ["mnick@honeycomb.be"],
            tag: "X5DDFJKLEE"
        }
    )
}