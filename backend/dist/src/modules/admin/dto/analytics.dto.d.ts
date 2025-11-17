export declare enum TimeRange {
    TODAY = "today",
    WEEK = "week",
    MONTH = "month",
    QUARTER = "quarter",
    YEAR = "year",
    CUSTOM = "custom"
}
export declare class AnalyticsQueryDto {
    range?: TimeRange;
    startDate?: string;
    endDate?: string;
}
export declare class ForecastQueryDto {
    days?: number;
    productId?: string;
}
