class ConfigService {
    constructor() {
        this.apiKey = "";
        //private apiBasePath: string = "https://extract.bluesuit.com/v1/";
        this.apiBasePath = "http://localhost:3000/";
    }
    setApiKey(apiKey) {
        this.apiKey = apiKey;
    }
    getApiKey() {
        return this.apiKey;
    }
    getApiBasePath() {
        return this.apiBasePath;
    }
}
const Configure = new ConfigService();
export { Configure, ConfigService };
//# sourceMappingURL=config.service.js.map