// src/api/leads.ts
// Ensure vite types exist somewhere in your project (e.g., src/vite-env.d.ts with `/// <reference types="vite/client" />`)

export type LeadPayload = {
	type: 'procurement' | 'sales';
	person_name: string;
	phone?: string;
	email?: string;
	company?: string;
	stage?: 'hot' | 'warm' | 'cold';
	status?: 'open' | 'hold' | 'wip' | 'rejected' | 'won' | 'lost';
	next_follow_up_at?: string; // YYYY-MM-DD
	tentative_order_qty?: number;
	tentative_qty_unit?: string;
	industry?: 'fmcg' | 'fnb' | 'pharma' | 'ayurvedic' | 'others';
	notes?: string;
	owner_id?: number;
};

type QueryParams = Record<string, string | number | boolean | undefined | null>;

const BASE: string =
	((import.meta as any).env?.VITE_API_URL as string | undefined) ?? 'http://localhost:8000';

function toQuery(params: QueryParams = {}): string {
	const pairs: [string, string][] = [];
	for (const [k, v] of Object.entries(params)) {
		if (v === undefined || v === null) continue;
		pairs.push([k, String(v)]);
	}
	return new URLSearchParams(pairs).toString();
}

async function handle<T>(res: Response): Promise<T> {
	if (!res.ok) {
		let msg = `HTTP ${res.status}`;
		try {
			const data = await res.json();
			msg = data?.detail ?? msg;
		} catch {}
		throw new Error(msg);
	}
	return res.json() as Promise<T>;
}

export async function listLeads(params: QueryParams = {}) {
	const q = toQuery(params);
	const res = await fetch(`${BASE}/api/leads${q ? `?${q}` : ''}`);
	return handle<any[]>(res);
}

export async function createLead(payload: LeadPayload) {
	const res = await fetch(`${BASE}/api/leads`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload),
	});
	return handle<any>(res);
}

export async function getLead(id: number) {
	const res = await fetch(`${BASE}/api/leads/${id}`);
	return handle<any>(res);
}

export async function updateLead(id: number, payload: Partial<LeadPayload>) {
	const res = await fetch(`${BASE}/api/leads/${id}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload),
	});
	return handle<any>(res);
}

export async function deleteLead(id: number) {
	const res = await fetch(`${BASE}/api/leads/${id}`, { method: 'DELETE' });
	if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

// Activities
export type ActivityPayload = {
    kind: string;
    body?: string;
    meta?: Record<string, unknown>;
};

export async function listActivities(leadId: number) {
    const res = await fetch(`${BASE}/api/leads/${leadId}/activities`);
    return handle<any[]>(res);
}

export async function addActivity(leadId: number, payload: ActivityPayload) {
    const res = await fetch(`${BASE}/api/leads/${leadId}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    return handle<any>(res);
}