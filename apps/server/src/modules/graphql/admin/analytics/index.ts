import prisma, { Arg, Field, Mutation, ObjectType, Query, Resolver, UseMiddleware } from "orm";
import { AdminAuth } from "../../../middleware/admin";
import { getGAEventsReport, getGAPageViewsReport, getReport, getReportByCountry, getRuntimeReport, initiateOAuth } from "../../../services/google-oauth";
import { GAConnection } from "orm/generated/type-graphql";
import { analyticsdata, analyticsdata_v1beta } from "googleapis/build/src/apis/analyticsdata";
import { report } from "process";

@ObjectType()
class GAReportMetaData {
    @Field(() => String, {
        nullable: true
    })
    currencyCode: string;

    @Field(() => String, {
        nullable: true
    })
    timeZone: string;
}

@ObjectType()
class GAReportHeaders {
    @Field(() => String, {
        nullable: true
    })
    name: string;

    @Field(() => String, {
        nullable: true
    })
    type: string;
}

@ObjectType()
class GAReportValuesMetaData {
    @Field(() => String, {
        nullable: true
    })
    value: string;
}

@ObjectType()
class GAReportValues {
    @Field(() => [GAReportValuesMetaData], {
        nullable: true
    })
    dimensionValues: GAReportValuesMetaData[];

    @Field(() => [GAReportValuesMetaData], {
        nullable: true
    })
    metricValues: GAReportValuesMetaData[];
}

@ObjectType()
export class GAReportResponse {
    @Field(() => Number, {
        nullable: true
    })
    rowCount: number;

    @Field(() => String, {
        nullable: true
    })
    kind: string;

    @Field(() => GAReportMetaData, {
        nullable: true
    })
    metadata: GAReportMetaData;

    @Field(() => [GAReportValues], {
        nullable: true
    })
    totals: GAReportValues[];

    @Field(() => [GAReportValues], {
        nullable: true
    })
    rows: GAReportValues[];

    @Field(() => [GAReportHeaders], {
        nullable: true
    })
    metricHeaders: GAReportHeaders[];

    @Field(() => [GAReportHeaders], {
        nullable: true
    })
    dimensionHeaders: GAReportHeaders[];
}

@Resolver()
export default class AdminAnalyticsResolver {
    @Query(() => String)
    @UseMiddleware(AdminAuth)
    async getGoogleAuthURL() {
        return initiateOAuth();
    }

    @Query(() => GAConnection)
    @UseMiddleware(AdminAuth)
    async getGAConnectionStatus(
    ) : Promise<GAConnection>{
        const _connection = await prisma.gAConnection.findFirst({
            where: {
                status: "CONNECTED"
            }
        });
        if (!_connection) {
            throw new Error("No Google Analytics connection found!");
        }
        return _connection;
    }

    @Mutation(() => Boolean)
    @UseMiddleware(AdminAuth)
    async unlinkGAConnection() {
        const _connection = await prisma.gAConnection.findFirst();
        if (!_connection) {
            throw new Error("No Google Analytics connection found!");
        }
        
        await prisma.gAConnection.deleteMany({});

        return true;
    }

    @Query(() => GAReportResponse)
    @UseMiddleware(AdminAuth)
    async getGAReport(
        @Arg("dateRanges", () => [String]) dateRanges: string[]
    ) : Promise<GAReportResponse>{
        const _report: any = await getReport(dateRanges);
        if (_report.rows && _report.rowCount) {
            return _report;
        } else {
            _report.rows = []
            _report.rowCount = 0;
            return _report;
        }
    }

    @Query(() => GAReportResponse)
    @UseMiddleware(AdminAuth)
    async getGAByCountryReport(
        @Arg("dateRanges", () => [String]) dateRanges: string[]
    ) : Promise<GAReportResponse>{
        const _report: any = await getReportByCountry(dateRanges);
        if (_report.rows && _report.rowCount) {
            return _report;
        } else {
            _report.rows = []
            _report.rowCount = 0;
            return _report;
        }
    }

    @Query(() => GAReportResponse)
    @UseMiddleware(AdminAuth)
    async getGARunTimeReport(
        @Arg("minuteRanges", () => [String]) minuteRanges: string[]
    ) : Promise<GAReportResponse>{
        let _report: any = await getRuntimeReport(minuteRanges);
        if (_report.rows && _report.rowCount) {
            return _report;
        } else {
            _report.rows = []
            _report.rowCount = 0;
            return _report;
        }
    }

    @Query(() => GAReportResponse)
    @UseMiddleware(AdminAuth)
    async getGAPageViewsReport(
        @Arg("dateRanges", () => [String]) dateRanges: string[]
    ): Promise<GAReportResponse> {
        const _report: any = await getGAPageViewsReport(dateRanges);
        if (_report.rows && _report.rowCount) {
            return _report;
        } else {
            _report.rows = []
            _report.rowCount = 0;
            return _report;
        }
    }
    
    @Query(() => GAReportResponse)
    @UseMiddleware(AdminAuth)
    async getGAEventsReport(
        @Arg("dateRanges", () => [String]) dateRanges: string[]
    ): Promise<GAReportResponse> {
        const _report: any = await getGAEventsReport(dateRanges);
        if (_report.rows && _report.rowCount) {
            return _report;
        } else {
            _report.rows = []
            _report.rowCount = 0;
            return _report;
        }
    }
}