// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import cors from 'cors';
import express from 'express';

import { prisma } from './db';
import {
	formatPaginatedResponse,
	parsePaginationForQuery,
	parseWhereStatement,
	WhereParam,
	WhereParamTypes,
} from './api-queries';

const app = express();
app.use(cors());

app.use(express.json());

app.get('/', async (req, res) => {
	return res.send({ message: '🚀 API is functional 🚀' });
});

app.get('/listings', async (req, res) => {
	const acceptedQueries: WhereParam[] = [
		{
			key: 'name',
			type: WhereParamTypes.STRING,
		},
		{
			key: 'description',
			type: WhereParamTypes.STRING,
		},
		{
			key: 'endTime',
			type: WhereParamTypes.NUMBER,
		},
        {
			key: 'minBid',
			type: WhereParamTypes.NUMBER,
		},
	];

	try {
		const locked = await prisma.listing.findMany({
			where: parseWhereStatement(req.query, acceptedQueries)!,
			...parsePaginationForQuery(req.query),
		});

		return res.send(formatPaginatedResponse(locked));
	} catch (e) {
		console.error(e);
		return res.status(400).send(e);
	}
});

app.get('/bids', async (req, res) => {
	const acceptedQueries: WhereParam[] = [
		{
			key: 'name',
			type: WhereParamTypes.STRING,
		},
		{
			key: 'bidAmount',
			type: WhereParamTypes.NUMBER,
		},
		{
			key: 'endTime',
			type: WhereParamTypes.NUMBER,
		},
        {
			key: 'minBid',
			type: WhereParamTypes.NUMBER,
		},
	];

	try {
		const escrows = await prisma.bid.findMany({
			where: parseWhereStatement(req.query, acceptedQueries)!,
			...parsePaginationForQuery(req.query),
		});

		return res.send(formatPaginatedResponse(escrows));
	} catch (e) {
		console.error(e);
		return res.status(400).send(e);
	}
});

app.listen(3000, () => console.log(`🚀 Server ready at: http://localhost:3000`));
