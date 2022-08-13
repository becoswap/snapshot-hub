import { create } from 'ipfs-http-client';

const client = create({ url: (process.env.IPFS as any) + '/api/v0' });

export async function pinJson(_: string, body) {
  const { cid } = await client.add(JSON.stringify(body));
  return cid.toString();
}
