export class rowViewModel {
    Arb: number;
    BackLayOdds: string;
    BackOdds: number;
    Color: string;
    Coupon: string;
    Event: string;
    FivePercent: number
    Id: number;
    ExchangeTypeId: number;
    LC: number;
    LayOdds: number;
    MarketDisplayName: string;
    When: string;
    EventId: number;
    MarketId: number;
    IsSelected: boolean = false
    TotalRecords: number = 0;
    BackOddsFra: string;
    Size: number;
    OddsUpdateCount: number;
    constructor(data: any) {
        this.Arb = data.Arb;
        this.BackLayOdds = data.BackLayOdds;
        this.BackOdds = data.BackOdds;
        this.Color = data.Color;
        this.Coupon = data.Coupon;
        this.Event = data.Event;
        this.FivePercent = data.FivePercent
        this.Id = data.Id;
        this.LC = data.LC;
        this.LayOdds = data.LayOdds;
        this.MarketDisplayName = data.MarketDisplayName;
        this.When = data.When;
        this.EventId = data.EventId;
        this.MarketId = data.MarketId;
        this.TotalRecords = data.TotalRecords;
        this.BackOddsFra = data.BackOddsFra;
        this.ExchangeTypeId = data.ExchangeTypeId;
        this.Size = data.Size;
        this.OddsUpdateCount = data.OddsUpdateCount;
    }
}