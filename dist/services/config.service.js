class ConfigService {
    constructor() {
        this.apiKey = "";
        this.apiBasePath = "https://extract.bluesuit.com/v1/";
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