export enum DocumentType {
    CLOSING_DISCLOSURE = "closing_disclosure",
    PROPERTY_DEED = "property_deed",
    RENT_ROLL = "rent_roll",
    PURCHASE_SALE_AGREEMENT = "psa",
    OFFERING_MEMO = "offering_memo"
}

export enum ProcessingType {
    ACCURATE = "accurate",
    QUICK = "quick",
    FOUNDATIONAL = "foundational"
}

export interface ProcessingOptions {
    email?: string[];
    tag?: string;
}

export interface ProccessingResponse {
    message: string;
    requestId?: string;
}

export interface CheckStatusResponse {
    message: string;
    requestId: string;
    location?: string;
}