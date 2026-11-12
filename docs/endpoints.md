# Endpoint reference

All 203 endpoints of the DataPorium Data API, grouped by category. Each one is a method on the client with the name shown, for example `await dp.companyInfo({ symbol: "AAPL" })`.

This page is generated from the public OpenAPI file at <https://dataporium.tech/openapi.json>. For parameter details and example answers see the [API documentation](https://dataporium.tech/api-docs), or print `dp.describe("<method name>")`. Parameter names are the API's own, so they stay in snake_case.

## Categories

- [Stock Directory](#stock-directory) (1)
- [Company Information](#company-information) (10)
- [Quote](#quote) (2)
- [News](#news) (2)
- [Stock Performance](#stock-performance) (5)
- [Financial Statements](#financial-statements) (6)
- [Earnings & Events](#earnings--events) (4)
- [Shareholder Data](#shareholder-data) (5)
- [Insider Trades](#insider-trades) (3)
- [US Elections](#us-elections) (9)
- [Politician Trades](#politician-trades) (11)
- [Government Contracts](#government-contracts) (2)
- [Lobbying](#lobbying) (2)
- [Patents](#patents) (2)
- [Trademarks](#trademarks) (3)
- [Private Fundraising](#private-fundraising) (2)
- [Short Interest](#short-interest) (8)
- [Drug Approvals](#drug-approvals) (5)
- [Healthcare Providers](#healthcare-providers) (35)
- [Options Data](#options-data) (1)
- [Market Hours](#market-hours) (2)
- [Economics](#economics) (8)
- [Industry Metrics](#industry-metrics) (3)
- [Forex](#forex) (1)
- [Commodity](#commodity) (2)
- [Futures Positioning](#futures-positioning) (3)
- [Agriculture](#agriculture) (3)
- [Gas Prices](#gas-prices) (3)
- [Electricity Rates & Grid Prices](#electricity-rates--grid-prices) (7)
- [Local Economy](#local-economy) (4)
- [Layoffs](#layoffs) (9)
- [Colleges](#colleges) (3)
- [Industries](#industries) (2)
- [Banks](#banks) (4)
- [Consumer Complaints](#consumer-complaints) (3)
- [Recalls](#recalls) (4)
- [Transportation](#transportation) (5)
- [Facility Compliance & Emissions](#facility-compliance--emissions) (3)
- [Employer Salaries](#employer-salaries) (4)
- [Mortgage Lending](#mortgage-lending) (3)
- [Real Estate](#real-estate) (7)
- [Flood Claims & Disasters](#flood-claims--disasters) (2)

## Stock Directory

| Method | Path | What it returns |
|---|---|---|
| `symbolsList` | `/symbols-list` | Symbols by Exchange |

## Company Information

| Method | Path | What it returns |
|---|---|---|
| `companyInfo` | `/company-info` | Company Info |
| `businessSegments` | `/business-segments` | Business Segments |
| `businessSegmentsQuarterly` | `/business-segments/quarterly` | Business Segments (Quarterly) |
| `businessSegmentsViews` | `/business-segments/views` | Business Segment Views |
| `businessSegmentsDetail` | `/business-segments/detail` | Business Segment Details |
| `logo` | `/logo` | Company Logo |
| `maTransactionsSummary` | `/ma-transactions-summary` | Mergers & Investments |
| `secFilings` | `/sec-filings` | SEC Filings |
| `presentations` | `/presentations` | Presentations |
| `industry` | `/industry` | Industry Classification |

## Quote

| Method | Path | What it returns |
|---|---|---|
| `stockPrice1d` | `/stock-price-1d` | Stock Price (1-Day) |
| `stockPrice5m` | `/stock-price-5m` | Stock Price (5-Minute) |

## News

| Method | Path | What it returns |
|---|---|---|
| `stockNews` | `/stock-news` | Stock News |
| `pressRelease` | `/press-release` | Press Releases |

## Stock Performance

| Method | Path | What it returns |
|---|---|---|
| `gainLoss` | `/gain-loss` | Stock Performance |
| `industryPerformance` | `/industry-performance` | Industry Performance |
| `industryPerformancePe` | `/industry-performance-pe` | Industry P/E |
| `sectorPerformance` | `/sector-performance` | Sector Performance |
| `sectorPerformancePe` | `/sector-performance-pe` | Sector P/E |

## Financial Statements

| Method | Path | What it returns |
|---|---|---|
| `incomeStatements` | `/income-statements` | Income Statement |
| `incomeStatementsSummary` | `/income-statements-summary` | Income Summary |
| `balanceSheetStatements` | `/balance-sheet-statements` | Balance Sheet |
| `balanceSheetStatementsSummary` | `/balance-sheet-statements-summary` | Balance Sheet Summary |
| `cashFlowStatements` | `/cash-flow-statements` | Cash Flow |
| `cashFlowStatementsSummary` | `/cash-flow-statements-summary` | Cash Flow Summary |

## Earnings & Events

| Method | Path | What it returns |
|---|---|---|
| `earningsTranscripts` | `/earnings-transcripts` | Earnings Transcripts |
| `earningsSplitCalendar` | `/earnings-split-calendar` | Earnings & Split Calendar |
| `ipoCalendar` | `/ipo-calendar` | IPO Calendar |
| `marketCalendar` | `/market-calendar` | Market Calendar |

## Shareholder Data

| Method | Path | What it returns |
|---|---|---|
| `shareholdersByType` | `/shareholders-by-type` | Shareholders by Type |
| `shareholdersGeo` | `/shareholders-geo` | Geographic Shareholders |
| `shareholdersClass` | `/shareholders-class` | Shareholders Class |
| `shareholdersQuarterly` | `/shareholders-quarterly` | Quarterly Shareholders |
| `shareholdersQuarterlySummary` | `/shareholders-quarterly-summary` | Quarterly Shareholders Summary |

## Insider Trades

| Method | Path | What it returns |
|---|---|---|
| `insiderTransactions` | `/insider-transactions` | Insider List |
| `insiderHoldingsSummary` | `/insider-holdings-summary` | Insider Summary |
| `insiderTransactionHistory` | `/insider-transaction-history` | Insider Transactions |

## US Elections

| Method | Path | What it returns |
|---|---|---|
| `electionsRaces` | `/elections/races` | Election Races |
| `electionsResults` | `/elections/results` | Election Results by Area |
| `electionsCandidates` | `/elections/candidates` | Election Candidates |
| `electionsGeographyLevelCode` | `/elections/geography/{level}/{code}` | Election Area Profile |
| `electionsArea` | `/elections/area` | Election Area Summary |
| `electionsSummary` | `/elections/summary` | Election Analysis |
| `electionsTurnout` | `/elections/turnout` | Election Turnout |
| `electionsLiveRaces` | `/elections/live/races` | Election Night Races |
| `electionsLiveSummary` | `/elections/live/summary` | Election Night Summary |

## Politician Trades

| Method | Path | What it returns |
|---|---|---|
| `politicianTrades` | `/politician-trades` | Politician Trades |
| `politicianTradesSummary` | `/politician-trades/summary` | Politician Trades Summary |
| `politicianTradesMembers` | `/politician-trades/members` | Politician Trades Members |
| `politicianTradesSymbols` | `/politician-trades/symbols` | Politician Trades Symbols |
| `politicianTradesMemberSearch` | `/politician-trades/member-search` | Politician Member Search |
| `politicianTradesNetWorth` | `/politician-trades/net-worth` | Politician Net Worth |
| `politicianTradesNetWorthSummary` | `/politician-trades/net-worth/summary` | Politician Net Worth Summary |
| `politicianTradesAssets` | `/politician-trades/assets` | Politician Assets |
| `politicianTradesInterests` | `/politician-trades/interests` | Politician Interests (Germany and Netherlands) |
| `politicianTradesInterestsSummary` | `/politician-trades/interests/summary` | Politician Interests Summary (Germany and Netherlands) |
| `politicianTradesHoldings` | `/politician-trades/holdings` | Politician Holdings (Germany) |

## Government Contracts

| Method | Path | What it returns |
|---|---|---|
| `governmentContracts` | `/government-contracts` | Government Contracts |
| `governmentContractsSummary` | `/government-contracts/summary` | Government Contracts Summary |

## Lobbying

| Method | Path | What it returns |
|---|---|---|
| `lobbying` | `/lobbying` | Lobbying Reports |
| `lobbyingSummary` | `/lobbying/summary` | Lobbying Summary |

## Patents

| Method | Path | What it returns |
|---|---|---|
| `patents` | `/patents` | Patents |
| `patentsSummary` | `/patents/summary` | Patents Summary |

## Trademarks

| Method | Path | What it returns |
|---|---|---|
| `trademarksFilings` | `/trademarks/filings` | Trademark Filings |
| `trademarksRankings` | `/trademarks/rankings` | Trademark Rankings |
| `trademarksOwners` | `/trademarks/owners` | Trademark Owners |

## Private Fundraising

| Method | Path | What it returns |
|---|---|---|
| `privateFundraising` | `/private-fundraising` | Private Fundraising |
| `privateFundraisingTotals` | `/private-fundraising/totals` | Private Fundraising Totals |

## Short Interest

| Method | Path | What it returns |
|---|---|---|
| `shortInterest` | `/short-interest` | Short Interest |
| `shortInterestRanking` | `/short-interest/ranking` | Most Shorted Stocks |
| `shortInterestSummary` | `/short-interest/summary` | Short Interest Summary |
| `shortInterestDates` | `/short-interest/dates` | Short Interest Dates |
| `shortInterestFilters` | `/short-interest/filters` | Short Interest Filters |
| `failsToDeliver` | `/fails-to-deliver` | Fails to Deliver |
| `failsToDeliverRanking` | `/fails-to-deliver/ranking` | Fails to Deliver Ranking |
| `failsToDeliverPeriods` | `/fails-to-deliver/periods` | Fails to Deliver Periods |

## Drug Approvals

| Method | Path | What it returns |
|---|---|---|
| `drugApprovals` | `/drug-approvals` | Drug Approvals |
| `drugApprovalsSummary` | `/drug-approvals/summary` | Drug Approvals Summary |
| `drugApprovalsCompanies` | `/drug-approvals/companies` | Drug Approvals by Company |
| `drugApprovalsCountries` | `/drug-approvals/countries` | Drug Approval Countries |
| `drugApprovalsDetail` | `/drug-approvals/detail` | Drug Approval Detail |

## Healthcare Providers

| Method | Path | What it returns |
|---|---|---|
| `healthcareHospitals` | `/healthcare/hospitals` | Hospitals |
| `healthcareHospitalsCcn` | `/healthcare/hospitals/{ccn}` | Hospital Detail |
| `healthcareHospitalsSummary` | `/healthcare/hospitals/summary` | Hospital Summary |
| `healthcareHealthSystems` | `/healthcare/health-systems` | Health Systems |
| `healthcareHealthSystemsSystemId` | `/healthcare/health-systems/{system_id}` | Health System Detail |
| `healthcareHospitalFinancials` | `/healthcare/hospital-financials` | Hospital Financials |
| `healthcareHospitalQuality` | `/healthcare/hospital-quality` | Hospital Quality |
| `healthcareProviders` | `/healthcare/providers` | Providers (NPI) |
| `healthcareProvidersNpi` | `/healthcare/providers/{npi}` | Provider Detail |
| `healthcareProvidersSummary` | `/healthcare/providers/summary` | Provider Counts |
| `healthcareSpecialties` | `/healthcare/specialties` | Specialties |
| `healthcareGroups` | `/healthcare/groups` | Group Practices |
| `healthcareProcedures` | `/healthcare/procedures` | Medicare Procedures |
| `healthcareProceduresCodes` | `/healthcare/procedures/codes` | Procedure Codes |
| `healthcareProceduresProviders` | `/healthcare/procedures/providers` | Procedure Providers and Summary |
| `healthcareLabTests` | `/healthcare/lab-tests` | Lab Tests |
| `healthcareHospitalProcedures` | `/healthcare/hospital-procedures` | Hospital Stays and Outpatient Services |
| `healthcarePrescriptions` | `/healthcare/prescriptions` | Medicare Prescriptions |
| `healthcarePrescriptionsDrugs` | `/healthcare/prescriptions/drugs` | Medicare Drugs |
| `healthcareDrugSpending` | `/healthcare/drug-spending` | Drug Spending |
| `healthcareMedicaidDrugs` | `/healthcare/medicaid-drugs` | Medicaid Drugs |
| `healthcarePayments` | `/healthcare/payments` | Payments to Doctors and Hospitals |
| `healthcarePaymentsCompanies` | `/healthcare/payments/companies` | Paying Companies, Recipients and Summary |
| `healthcareCompaniesTicker` | `/healthcare/companies/{ticker}` | Listed Company Medicare Summary |
| `healthcareLabs` | `/healthcare/labs` | Certified Labs |
| `healthcareLabsSummary` | `/healthcare/labs/summary` | Lab Counts and Lab Companies |
| `healthcareLabTestsSegments` | `/healthcare/lab-tests/segments` | Medicare Lab Tests by Segment and Category |
| `healthcareDeviceProcedures` | `/healthcare/device-procedures` | Device Procedures |
| `healthcareDeviceProceduresHospitals` | `/healthcare/device-procedures/hospitals` | Device Hospital Stays and Outpatient Services |
| `healthcareDeviceProceduresIcd` | `/healthcare/device-procedures/icd` | California Inpatient Procedures by ICD-10-PCS Code |
| `healthcareMedicalEquipment` | `/healthcare/medical-equipment` | Medical Equipment and Supplies |
| `healthcareDevicesApprovals` | `/healthcare/devices/approvals` | Device Approvals |
| `healthcareDevicesRecalls` | `/healthcare/devices/recalls` | Device Recalls and Adverse Events |
| `healthcareDevicesCompanies` | `/healthcare/devices/companies` | Device Makers |
| `healthcareDrugsAdverseEventsDrug` | `/healthcare/drugs/adverse-events/{drug}` | Drug Side-Effect Reports |

## Options Data

| Method | Path | What it returns |
|---|---|---|
| `optionsCallsputs` | `/options-callsputs` | Options Calls & Puts |

## Market Hours

| Method | Path | What it returns |
|---|---|---|
| `exchangeHoliday` | `/exchange-holiday` | Exchange Holidays |
| `exchangeHours` | `/exchange-hours` | Exchange Hours |

## Economics

| Method | Path | What it returns |
|---|---|---|
| `economicMetrics` | `/economic-metrics` | Economic Metrics |
| `treasuryYields` | `/treasury-yields` | Treasury Yields |
| `treasuryYieldsCurve` | `/treasury-yields/curve` | Yield Curve |
| `fedDecisions` | `/fed-decisions` | Fed Rate Decisions |
| `inflationCategories` | `/inflation-categories` | Inflation by Category |
| `corporateBondYields` | `/corporate-bond-yields` | Corporate Bond Yields |
| `usTrade` | `/us-trade` | US Trade |
| `usTradeSummary` | `/us-trade/summary` | US Trade Summary |

## Industry Metrics

| Method | Path | What it returns |
|---|---|---|
| `industryMetrics` | `/industry-metrics` | Industry Metrics Over Time |
| `industryMetricsSeries` | `/industry-metrics/series` | Industry Metric Series |
| `industryMetricsLatest` | `/industry-metrics/latest` | Industry Rankings (Latest Period) |

## Forex

| Method | Path | What it returns |
|---|---|---|
| `fx` | `/fx` | FX Conversion |

## Commodity

| Method | Path | What it returns |
|---|---|---|
| `commodityPrice1d` | `/commodity-price-1d` | Commodity Price (1-Day) |
| `commodityPrice5m` | `/commodity-price-5m` | Commodity Price (5-Minute) |

## Futures Positioning

| Method | Path | What it returns |
|---|---|---|
| `futuresPositioning` | `/futures-positioning` | Futures Positioning History |
| `futuresPositioningMarketsMarket` | `/futures-positioning/markets/{market}` | Futures Market Positioning (Latest Week) |
| `futuresPositioningLatest` | `/futures-positioning/latest` | Most Net Long and Net Short Futures |

## Agriculture

| Method | Path | What it returns |
|---|---|---|
| `agricultureCommodities` | `/agriculture/commodities` | Agriculture Commodities |
| `agricultureStats` | `/agriculture/stats` | Agriculture Statistics |
| `agriculturePrices` | `/agriculture/prices` | Agriculture Prices |

## Gas Prices

| Method | Path | What it returns |
|---|---|---|
| `gasPrices` | `/gas-prices` | Gas Prices |
| `gasPricesLocal` | `/gas-prices/local` | Daily Local Gas Prices |
| `gasPricesLocalNearest` | `/gas-prices/local/nearest` | Nearest Local Gas Price |

## Electricity Rates & Grid Prices

| Method | Path | What it returns |
|---|---|---|
| `electricityRates` | `/electricity-rates` | Electricity Rates by Utility |
| `electricityRatesStates` | `/electricity-rates/states` | Electricity Rates by State |
| `electricityRatesUtilitiesUtilityId` | `/electricity-rates/utilities/{utility_id}` | One Utility |
| `electricityRatesCountyCountyFips` | `/electricity-rates/county/{county_fips}` | Electricity Prices of a County |
| `gridPricesLocations` | `/grid-prices/locations` | Grid Price Locations |
| `gridPrices` | `/grid-prices` | Grid Prices |
| `gridPricesLatest` | `/grid-prices/latest` | Latest Grid Prices |

## Local Economy

| Method | Path | What it returns |
|---|---|---|
| `localJobs` | `/local-jobs` | Local Jobs (Unemployment) |
| `localWages` | `/local-wages` | Local Wages (Jobs and Pay) |
| `buildingPermits` | `/building-permits` | Building Permits |
| `migration` | `/migration` | Migration (Moves In and Out) |

## Layoffs

| Method | Path | What it returns |
|---|---|---|
| `layoffsEvents` | `/layoffs/events` | Layoff Events |
| `layoffsSummary` | `/layoffs/summary` | Layoffs Summary |
| `layoffsCompanies` | `/layoffs/companies` | Companies by Layoffs |
| `layoffsCompanyTicker` | `/layoffs/company/{ticker}` | Company Layoffs |
| `layoffsStateState` | `/layoffs/state/{state}` | State Layoffs |
| `layoffsIndustryNaics` | `/layoffs/industry/{naics}` | Industry Layoffs |
| `layoffsOverview` | `/layoffs/overview` | Layoffs Overview |
| `layoffsOfficialJolts` | `/layoffs/official/jolts` | Official Layoffs (JOLTS) |
| `layoffsOfficialClaims` | `/layoffs/official/claims` | Unemployment Claims |

## Colleges

| Method | Path | What it returns |
|---|---|---|
| `colleges` | `/colleges` | Colleges |
| `collegesSummary` | `/colleges/summary` | College Summary |
| `collegesPrograms` | `/colleges/programs` | College Programs and Majors |

## Industries

| Method | Path | What it returns |
|---|---|---|
| `industries` | `/industries` | Industry List |
| `industryAreaStats` | `/industry-area-stats` | Businesses, Employees and Payroll by Industry |

## Banks

| Method | Path | What it returns |
|---|---|---|
| `banks` | `/banks` | Banks and Credit Unions |
| `banksScreener` | `/banks/screener` | Bank Screener |
| `bankBranches` | `/bank-branches` | Bank Branches and Deposits |
| `bankFailures` | `/bank-failures` | Bank Failures |

## Consumer Complaints

| Method | Path | What it returns |
|---|---|---|
| `consumerComplaintsTotals` | `/consumer-complaints/totals` | Complaints Over Time |
| `consumerComplaintsBreakdown` | `/consumer-complaints/breakdown` | Complaints Breakdown |
| `consumerComplaintsCompanies` | `/consumer-complaints/companies` | Complaint Companies |

## Recalls

| Method | Path | What it returns |
|---|---|---|
| `recalls` | `/recalls` | Recalls |
| `recallsTotals` | `/recalls/totals` | Recall Totals |
| `vehicleRatings` | `/vehicle-ratings` | Vehicle Safety Ratings |
| `vehicleComplaints` | `/vehicle-complaints` | Vehicle Owner Complaints |

## Transportation

| Method | Path | What it returns |
|---|---|---|
| `airlines` | `/airlines` | Airlines |
| `airports` | `/airports` | Airports and Air Routes |
| `truckingCarriers` | `/trucking/carriers` | Trucking Carriers |
| `truckingStats` | `/trucking/stats` | Trucking by State and Month |
| `portVolumes` | `/port-volumes` | Port Container Volumes |

## Facility Compliance & Emissions

| Method | Path | What it returns |
|---|---|---|
| `complianceFacilities` | `/compliance/facilities` | Facilities |
| `complianceCompanies` | `/compliance/companies` | Listed Companies |
| `emissions` | `/emissions` | Greenhouse Gas Emissions |

## Employer Salaries

| Method | Path | What it returns |
|---|---|---|
| `employerSalariesTotals` | `/employer-salaries/totals` | Salary Totals |
| `employerSalariesEmployers` | `/employer-salaries/employers` | Employers |
| `employerSalariesJobs` | `/employer-salaries/jobs` | Job Groups |
| `employerSalariesAreas` | `/employer-salaries/areas` | Areas |

## Mortgage Lending

| Method | Path | What it returns |
|---|---|---|
| `mortgageLendingSummary` | `/mortgage-lending/summary` | Mortgage Lending Summary |
| `mortgageLendingAreas` | `/mortgage-lending/areas` | Mortgage Lending by Area |
| `mortgageLendingLenders` | `/mortgage-lending/lenders` | Mortgage Lenders |

## Real Estate

| Method | Path | What it returns |
|---|---|---|
| `properties` | `/properties` | Properties (Search and Detail) |
| `realestatePriceChanges` | `/realestate-price-changes` | Price Changes and Relists |
| `realestateForSale` | `/realestate-for-sale` | Properties For Sale |
| `realestateSold` | `/realestate-sold` | Properties Sold |
| `realestatePending` | `/realestate-pending` | Pending Sales |
| `realestateRent` | `/realestate-rent` | Rental Properties |
| `propertyTax` | `/property-tax` | Property Tax |

## Flood Claims & Disasters

| Method | Path | What it returns |
|---|---|---|
| `floodInsurance` | `/flood-insurance` | Flood Insurance Claims |
| `disasters` | `/disasters` | Declared Disasters |
