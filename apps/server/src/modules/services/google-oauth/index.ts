import { auth } from "@googleapis/analytics";
import { GA_PROPERTY_ID, GA_REDIRECT_URL, GOOGLE_CLIENT_ID, GOOGLE_SECRET } from "../../../config/global";
import { google } from 'googleapis';
import prisma from "orm";

const oauth2Client = new google.auth.OAuth2(
	GOOGLE_CLIENT_ID,
	GOOGLE_SECRET,
	GA_REDIRECT_URL
);
export const initiateOAuth = () => {
	const scopes = [
		"https://www.googleapis.com/auth/userinfo.profile",
		"https://www.googleapis.com/auth/userinfo.email",
		"https://www.googleapis.com/auth/analytics.readonly",
		"https://www.googleapis.com/auth/analytics"
	];

	const url = oauth2Client.generateAuthUrl({
		access_type: "offline",
		prompt: "consent",
		include_granted_scopes: true,
		client_id: GOOGLE_CLIENT_ID,
		redirect_uri: GA_REDIRECT_URL,
		scope: scopes,
	});

	return url;
}

export const getAuthTokens = async (code: string) => {
	return new Promise((resolve, reject) => {
		oauth2Client.getToken(code, async (err, tokens) => {
			if (err) {
				console.log("Tokens Error: ", err);
				reject(false);
			} else {
				oauth2Client.setCredentials(tokens);
				const _gaConnection = await prisma.gAConnection.findFirst();
				if (_gaConnection) {
					await prisma.gAConnection.update({
						where: {
							id: _gaConnection.id
						},
						data: {
							access_token: tokens.access_token,
							expiry_date: tokens.expiry_date.toString(),
							refresh_token: tokens.refresh_token,
							status: "CONNECTED",
							updated_at: new Date(),
							// email: ""
						}
					});
				} else {
					await prisma.gAConnection.create({
						data: {
							access_token: tokens.access_token,
							expiry_date: tokens.expiry_date.toString(),
							refresh_token: tokens.refresh_token,
							status: "CONNECTED"
						}
					});
				}
				resolve(true);
			}
		});
	});
}

export const exchangeGoogleAuthCode = async (
	token,
) => {
	const _auth = new auth.OAuth2(
		GOOGLE_CLIENT_ID,
		GOOGLE_SECRET,
		GA_REDIRECT_URL,
	);
	return (await _auth.getToken(token)).tokens;
};

export const getReport = async (dateRanges: string[]) => {
	const _auth = new google.auth.OAuth2(
		GOOGLE_CLIENT_ID,
		GOOGLE_SECRET,
	);
	const _gaConnection = await prisma.gAConnection.findFirst();
	if (!_gaConnection) {
		throw new Error("Google Analytics auth failed!");
	}
	_auth.setCredentials({
		expiry_date: Number(_gaConnection.expiry_date),
		access_token: _gaConnection.access_token,
		scope:
			"https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/analytics",
		token_type: "Bearer",
		refresh_token: _gaConnection.refresh_token,
	});
	const analytics = google.analyticsdata({ version: "v1beta", auth: _auth });
	const currentYear = new Date().getFullYear()
	dateRanges = [
		`${currentYear}-01-01/${currentYear}-03-31`,
		`${currentYear}-04-01/${currentYear}-06-30`,
		`${currentYear}-07-01/${currentYear}-09-30`,
		`${currentYear}-10-01/${currentYear}-12-31`
	]
	const dateRangesInput = [];
	for (let range of dateRanges) {
		dateRangesInput.push({
			"startDate": range.split('/')[0],
			"endDate": range.split('/')[1]
		});
	}
	const data = await analytics.properties.runReport({
		property: `properties/${GA_PROPERTY_ID}`, requestBody: {
			"dimensions": [
				{
					"name": "country"
				}
			],
			"metrics": [
				{
					"name": "activeUsers"
				},
				{
					"name": "averageSessionDuration"
				},
				{
					"name": "newUsers"
				},
				{
					"name": "totalUsers"
				}
			],
			"dateRanges": dateRangesInput,
			"keepEmptyRows": true,
			"metricAggregations": [
				"TOTAL"
			]
		}
	});

	return data.data;
}

export const getReportByCountry = async (dateRanges: string[]) => {
	const _auth = new google.auth.OAuth2(
		GOOGLE_CLIENT_ID,
		GOOGLE_SECRET,
	);
	const _gaConnection = await prisma.gAConnection.findFirst();
	if (!_gaConnection) {
		throw new Error("Google Analytics auth failed!");
	}
	_auth.setCredentials({
		expiry_date: Number(_gaConnection.expiry_date),
		access_token: _gaConnection.access_token,
		scope:
			"https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/analytics",
		token_type: "Bearer",
		refresh_token: _gaConnection.refresh_token,
	});
	const analytics = google.analyticsdata({ version: "v1beta", auth: _auth });
	const dateRangesInput = [];
	for (let range of dateRanges) {
		dateRangesInput.push({
			"startDate": range.split('/')[0],
			"endDate": range.split('/')[1]
		});
	}
	const data = await analytics.properties.runReport({
		property: `properties/${GA_PROPERTY_ID}`, requestBody: {
			"dimensions": [
				{
					"name": "country"
				}
			],
			"metrics": [
				{
					"name": "activeUsers"
				},
				{
					"name": "averageSessionDuration"
				},
				{
					"name": "newUsers"
				},
				{
					"name": "totalUsers"
				}
			],
			"dateRanges": dateRangesInput,
			"keepEmptyRows": true,
			"metricAggregations": [
				"TOTAL"
			]
		}
	});

	return data.data;
}

export const getRuntimeReport = async (minuteRanges: string[]) => {
	const _auth = new google.auth.OAuth2(
		GOOGLE_CLIENT_ID,
		GOOGLE_SECRET,
	);
	const _gaConnection = await prisma.gAConnection.findFirst();
	if (!_gaConnection) {
		throw new Error("Google Analytics auth failed!");
	}
	_auth.setCredentials({
		expiry_date: Number(_gaConnection.expiry_date),
		access_token: _gaConnection.access_token,
		scope:
			"https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/analytics",
		token_type: "Bearer",
		refresh_token: _gaConnection.refresh_token,
	});
	const analytics = google.analyticsdata({ version: "v1beta", auth: _auth });
	let minuteRangesInput = [];
	minuteRanges.forEach((range) => {
		if (range.includes("0")) {
			minuteRangesInput.push({
				name: `${range} minutes ago`,
				startMinutesAgo: range.split("-")[1]
			});
		} else {
			minuteRangesInput.push({
				name: `${range} minutes ago`,
				startMinutesAgo: range.split("-")[1],
				endMinutesAgo: range.split("-")[0]
			});
		}
	});
	const data = await analytics.properties.runRealtimeReport({
		property: `properties/${GA_PROPERTY_ID}`,
		requestBody: {
			"metrics": [
				{
					"name": "activeUsers"
				}
			],
			"minuteRanges": minuteRangesInput,
		}
	});

	return data.data;
}

export const getGAPageViewsReport = async (dateRanges: string[]) => {
	const _auth = new google.auth.OAuth2(
		GOOGLE_CLIENT_ID,
		GOOGLE_SECRET,
	);
	const _gaConnection = await prisma.gAConnection.findFirst();
	if (!_gaConnection) {
		throw new Error("Google Analytics auth failed!");
	}
	_auth.setCredentials({
		expiry_date: Number(_gaConnection.expiry_date),
		access_token: _gaConnection.access_token,
		scope:
			"https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/analytics",
		token_type: "Bearer",
		refresh_token: _gaConnection.refresh_token,
	});
	const analytics = google.analyticsdata({ version: "v1beta", auth: _auth });
	const dateRangesInput = [];
	for (let range of dateRanges) {
		dateRangesInput.push({
			"startDate": range.split('/')[0],
			"endDate": range.split('/')[1]
		});
	}
	const data = await analytics.properties.runReport({
		property: `properties/${GA_PROPERTY_ID}`,
		requestBody: {
			"dimensions": [
				{
					"name": "pagePath"
				}
			],
			"metrics": [
				{
					"name": "screenPageViews"
				}
			],
			"dateRanges": dateRangesInput,
			"keepEmptyRows": true
		}
	});

	return data.data;
}

export const getGAEventsReport = async (dateRanges: string[]) => {
	const _auth = new google.auth.OAuth2(
		GOOGLE_CLIENT_ID,
		GOOGLE_SECRET,
	);
	const _gaConnection = await prisma.gAConnection.findFirst();
	if (!_gaConnection) {
		throw new Error("Google Analytics auth failed!");
	}
	_auth.setCredentials({
		expiry_date: Number(_gaConnection.expiry_date),
		access_token: _gaConnection.access_token,
		scope:
			"https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/analytics",
		token_type: "Bearer",
		refresh_token: _gaConnection.refresh_token,
	});
	const analytics = google.analyticsdata({ version: "v1beta", auth: _auth });
	const dateRangesInput = [];
	for (let range of dateRanges) {
		dateRangesInput.push({
			"startDate": range.split('/')[0],
			"endDate": range.split('/')[1]
		});
	}
	const data = await analytics.properties.runReport({
		property: `properties/${GA_PROPERTY_ID}`,
		requestBody: {
			"dimensions": [
				{
					"name": "eventName"
				}
			],
			"metrics": [
				{
					"name": "eventCount"
				}
			],
			"dateRanges": dateRangesInput,
			"keepEmptyRows": true
		}
	});

	return data.data;
}
