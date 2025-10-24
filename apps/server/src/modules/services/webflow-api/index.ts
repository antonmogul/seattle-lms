import fetch from "node-fetch";
import { WEBFLOW_API_BASE_URL, webflowCMSCollections, webflowCollections, WEBFLOW_SITE_ID, WEBFLOW_API_BETA_URL } from "../../../config/global";

type HotelData = {
    fieldData: {
        name: string
        nid: string
        description: string
        desc: string
        region: string
        images: { url: string, alt: string }
        country: string
        state: string
        city: string
        amenities: string[]
        "location-lat-lng": string
        "rates-starting-from": number
        "iprefer-member-s-choice-winner": boolean
        "book-with-points-2": boolean
        "booking-link": string
        "website-link": string
        "accommodation-description-temp": string
    },
    isDraft: boolean,
    isArchived: boolean,
}

type ReferenceCollectionsData = {
    fieldData: {
        name: string
    },
    isDraft?: false,
    isArchived?: false,
}

export const listCollections = () => {
    const url = `${WEBFLOW_API_BASE_URL}/sites/${WEBFLOW_SITE_ID}/collections`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            authorization: `Bearer ${process.env.WEBFLOW_TOKEN}`
        }
    };

    return fetch(url, options);
}

export const listCollectionItems = (collection: webflowCMSCollections, offset: number = 0) => {
    const collectionId = webflowCollections[collection];
    const url = `${WEBFLOW_API_BASE_URL}/collections/${collectionId}/items?offset=${offset}`;
    const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        authorization: `Bearer ${process.env.WEBFLOW_TOKEN}`
    }
    };

    return fetch(url, options)
}

export const listCollectionItemsPageWise = (collection: webflowCMSCollections, offset: number) => {
    const collectionId = webflowCollections[collection];
    const url = `${WEBFLOW_API_BASE_URL}/collections/${collectionId}/items?offset=${offset}&limit=100`;
    const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        authorization: `Bearer ${process.env.WEBFLOW_TOKEN}`
    }
    };

    return fetch(url, options)
}

const findOrCreateInWebflow = async (data: ReferenceCollectionsData, collection: webflowCMSCollections) => {
    let collectionItem = null;
    let offset = 0, total = 1, noOfRecords = 100;
    while(offset <= total) {
        const collectionItemsData = (await (await listCollectionItemsPageWise(collection, offset)).json());
        collectionItem = collectionItemsData ? collectionItemsData.items.find((r => r.fieldData.name.toLowerCase() === data.fieldData.name.toLowerCase())): null;
        if (collectionItem) {
            break;
        } else {
            total = collectionItemsData.pagination.total;
            offset += (noOfRecords);
        }
    }
    if (!collectionItem) {
        const collectionId = webflowCollections[collection];
        const url = `${WEBFLOW_API_BASE_URL}/collections/${collectionId}/items`;
        const options = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                authorization: `Bearer ${process.env.WEBFLOW_TOKEN}`
            },
            body: JSON.stringify(data)
        };

        collectionItem = ((await fetch(url, options)).json());     
    }
    return collectionItem.id;
}

export const publishCollectionItems = async (collectionId: string, itemIds: string[]) => {
    const url = `${WEBFLOW_API_BASE_URL}/collections/${collectionId}/items/publish`;
    
    const batches = chunkArray(itemIds, 50);
    let results = [];

    // Publish in batches of 100
    for (const batch of batches) {
        const body = { itemIds: batch };
        try {
            const result = await fetchWebflowAPIWithRateLimit(url, 'POST', body, process.env.WEBFLOW_TOKEN);
            // console.log(`Batch publish successful, published ${batch.length} items`, result);
            results.push(result);
        } catch (error) {
            console.error(`Error occurred while publishing items: ${error.message}`);
            throw error;
        }
    }

    return results;
}

export const searchCollectionItems = async (collection: webflowCMSCollections, searchTerm: string) => {
    let noOfRecords = 100, offset = 0, total = 1;
    const collectionItems = [];
    while(offset <= total) {
        const collectionItemsData = (await (await listCollectionItemsPageWise(collection, offset)).json());
        const filteredCollectionItems = collectionItemsData.items.filter((r => r.fieldData.name.toLowerCase().includes(searchTerm.toLowerCase())));
        // console.log("This is the search results", filteredCollectionItems);
        if (filteredCollectionItems) {
            collectionItems.push(...filteredCollectionItems);
            total = collectionItemsData.pagination.total;
            offset += (noOfRecords);
        } else {
            break;
        }
    }
    return collectionItems;
}

export const deleteCollectionItem = async (collectionId: string, itemId: string) => {
    const url = `${WEBFLOW_API_BASE_URL}/collections/${collectionId}/items/${itemId}`;
    const options = {
        method: 'DELETE',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            authorization: `Bearer ${process.env.WEBFLOW_TOKEN}`
        }
    };

    return fetch(url, options);
}

export const listAllCollectionItems = async (collection: webflowCMSCollections) => {
    let items = [];
    let offset = 0;
    let total = 0;
    const collectionId = webflowCollections[collection];

    do {
        const url = `https://api.webflow.com/v2/collections/${collectionId}/items?offset=${offset}&limit=100`;
        const response = await fetchWebflowAPIWithRateLimit(url, 'GET', null, process.env.WEBFLOW_TOKEN);
        items = items.concat(response.items);
        total = response.pagination.total; // Total number of items
        offset += 100;
    } while (offset < total);

    return items;
}

export const updateCollectionItems = async (collectionId: string, items) => {
    const url = `${WEBFLOW_API_BETA_URL}/collections/${collectionId}/items`;

    // Split items into batches of 100
    const itemBatches = chunkArray(items, 100);
    let results = [];

    for (const batch of itemBatches) {
        const body = { items: batch };
        try {
            const result = await fetchWebflowAPIWithRateLimit(url, 'PATCH', body, process.env.WEBFLOW_TOKEN);
            // console.log(`Batch update successful, updated ${batch.length} items`);
            results.push(result);
        } catch (error) {
            console.error(`Error occurred while updating items: ${error.message}`);
            throw error;
        }
    }

    return results;
}

/** 
 * Helper function to fetch Webflow APIs with rate limiting 
 * */
export const fetchWebflowAPIWithRateLimit = async (url, method = 'GET', body = null, token) => {
    const headers = {
        'authorization': `Bearer ${token}`,
        'accept-version': '2.0.0',
        'Content-Type': 'application/json',
        'accept': 'application/json'
    };

    let options = { method, headers };
    if (body) options["body"] = JSON.stringify(body);

    while (true) {
        const response = await fetch(url, options);

        if (response.status === 429) {
            // Handle rate limit exceeded
            const retryAfter = response.headers.get('x-ratelimit-reset');
            const waitTime = retryAfter * 1000 - Date.now();
            // console.log(`Rate limit reached. Waiting for ${waitTime}ms...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            continue;  // Retry the request
        }

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        return await response.json();
    }
}


/**
 * Helper function to split items in 100s
 */
const chunkArray = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
};