"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForecastQueryDto = exports.AnalyticsQueryDto = exports.TimeRange = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var TimeRange;
(function (TimeRange) {
    TimeRange["TODAY"] = "today";
    TimeRange["WEEK"] = "week";
    TimeRange["MONTH"] = "month";
    TimeRange["QUARTER"] = "quarter";
    TimeRange["YEAR"] = "year";
    TimeRange["CUSTOM"] = "custom";
})(TimeRange || (exports.TimeRange = TimeRange = {}));
class AnalyticsQueryDto {
    constructor() {
        this.range = TimeRange.MONTH;
    }
}
exports.AnalyticsQueryDto = AnalyticsQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: TimeRange, default: TimeRange.MONTH }),
    (0, class_validator_1.IsEnum)(TimeRange),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AnalyticsQueryDto.prototype, "range", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AnalyticsQueryDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AnalyticsQueryDto.prototype, "endDate", void 0);
class ForecastQueryDto {
    constructor() {
        this.days = 30;
    }
}
exports.ForecastQueryDto = ForecastQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of days to forecast', default: 30 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ForecastQueryDto.prototype, "days", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Product ID to forecast', required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ForecastQueryDto.prototype, "productId", void 0);
//# sourceMappingURL=analytics.dto.js.map