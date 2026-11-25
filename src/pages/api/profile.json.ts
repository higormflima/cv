import type { APIRoute } from 'astro';
import { cv } from '../../data/cv';

export const GET: APIRoute = () =>
  new Response(JSON.stringify(cv, null, 2), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
