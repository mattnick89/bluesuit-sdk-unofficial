class ConfigService {
    
    private apiKey: string = "";
    private apiBasePath: string = "https://extract.bluesuit.com/v1/";

    constructor(){}

    public setApiKey(apiKey: string): void {
        this.apiKey = apiKey;
    }

    public getApiKey(): string {
        return this.apiKey;
    }

    public getApiBasePath(): string {
        return this.apiBasePath;
    }
}
const Configure: ConfigService = new ConfigService();
export { Configure , ConfigService};