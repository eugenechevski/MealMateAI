import { NextApiRequest, NextApiResponse } from "next";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    const imageUrl = req.query.url;

    if (!imageUrl) {
        return res.status(400).send('Missing URL parameter');
    }

    try {
        const response = await fetch(imageUrl as string);
        const imageBuffer = await response.arrayBuffer();

        res.setHeader('Content-Type', response.headers.get('Content-Type') || 'application/octet-stream');
        return res.status(200).send(Buffer.from(imageBuffer));
    } catch (error) {
        console.error(error);
        return res.status(500).send('An error occurred while fetching the image');
    }
}