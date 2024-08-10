---
title: 'Caching Airtable API requests using Azure Functions'
description: 'Basic code to wrap Airtable API requests using Azure Functions.'
pubDate: 2024-02-08
tags: ['azure-functions']
---

At work we built a basic casino app that leveraged Airtable to store player transactions. To prevent hitting API limits and sending our Airtable tokens to the client, we proxied our Airtable requests through an Azure Function, created with our [Static Web App](https://learn.microsoft.com/en-us/azure/static-web-apps/overview).

## Server-side

```javascript
/* api/src/functions/airtable.mjs */

import { app } from '@azure/functions';
import NodeFetch from 'node-fetch';
import NodeCache from 'node-cache';

const AIRTABLE_API = `https://api.airtable.com/v0`;
const RESPONSE = {
  headers: {
    'Content-Type': 'application/json',
  },
};

const cache = new NodeCache({ stdTTL: 2 });

app.http('getTable', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'v0/{boardId}/{tableId}',
  handler: async (request, context) => {
    context.log(`GET HTTP function processed request for url "${request.url}"`);

    if (cache.has(request.url)) {
      console.log(`Cache hit. Returning cached content.`);

      let json = cache.get(request.url);

      return {
        ...RESPONSE,
        body: JSON.stringify(json),
      };
    }

    console.log(`Cache miss. Retrieving content from Airtable.`);

    const { boardId, tableId } = request.params;
    const url = `${AIRTABLE_API}/${boardId}/${tableId}?${request.query.toString()}`;

    const response = await NodeFetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
      },
    });

    let json = await response.json();

    cache.set(request.url, json);

    return {
      ...RESPONSE,
      body: JSON.stringify(json),
    };
  },
});

app.http('getRecord', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'v0/{boardId}/{tableId}/{recordId}',
  handler: async (request, context) => {
    context.log(`GET HTTP function processed request for url "${request.url}"`);

    if (cache.has(request.url)) {
      console.log(`Cache hit. Returning cached content.`);

      let json = cache.get(request.url);

      return {
        ...RESPONSE,
        body: JSON.stringify(json),
      };
    }

    console.log(`Cache miss. Retrieving content from Airtable.`);

    const { boardId, tableId, recordId } = request.params;
    const url = `${AIRTABLE_API}/${boardId}/${tableId}/${recordId}?${request.query.toString()}`;

    const response = await NodeFetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
      },
    });

    let json = await response.json();

    cache.set(request.url, json);

    return {
      ...RESPONSE,
      body: JSON.stringify(json),
    };
  },
});

/** Patch, post and delete records removed for brevity */
```

## Client-side

```typescript
/* src/app/_services/get-table.ts */

import Airtable from 'airtable';

const isServer = typeof window === 'undefined';

export function getTable(tableId: string) {
  const base = new Airtable({
    apiKey: 'fake-key',
    // Enforce our proxied endpoint URL
    endpointUrl: `${window.location.protocol}//${window.location.hostname}${
      window.location.port ? `:${window.location.port}` : ``
    }/api`,
  }).base(process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID);

  return base(tableId);
}
```
