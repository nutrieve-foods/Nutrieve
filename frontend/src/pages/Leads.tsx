import { useEffect, useState } from 'react';
import { listLeads, createLead, listActivities, addActivity } from '../api/leads';

type Lead = any;

export default function Leads() {
	const [leads, setLeads] = useState<Lead[]>([]);
	const [loading, setLoading] = useState(false);
	const [name, setName] = useState('');
	const [filters, setFilters] = useState<{ type?: string; stage?: string; status?: string }>({ type: 'sales' });
	const [selected, setSelected] = useState<any | null>(null);
	const [activities, setActivities] = useState<any[]>([]);
	const [note, setNote] = useState('');

	async function load() {
		setLoading(true);
		try { setLeads(await listLeads(filters)); }
		finally { setLoading(false); }
	}

	useEffect(() => { load(); }, []);

	async function onAdd(e: React.FormEvent) {
		e.preventDefault();
		if (!name.trim()) return;
		await createLead({ type: (filters.type as any) ?? 'sales', person_name: name, stage: 'hot', status: 'open' });
		setName('');
		load();
	}

	async function loadActivities(lead: any) {
		setSelected(lead);
		const acts = await listActivities(lead.id);
		setActivities(acts);
	}

	async function onAddNote(e: React.FormEvent) {
		e.preventDefault();
		if (!selected || !note.trim()) return;
		await addActivity(selected.id, { kind: 'note', body: note });
		setNote('');
		loadActivities(selected);
	}

	return (
		<div className="p-6 space-y-6">
			<div className="flex flex-wrap gap-3 items-end">
				<div className="flex flex-col">
					<label className="text-sm text-gray-600">Type</label>
					<select className="border px-3 py-2 rounded" value={filters.type ?? ''} onChange={(e) => setFilters(f => ({ ...f, type: e.target.value || undefined }))}>
						<option value="">All</option>
						<option value="sales">Sales</option>
						<option value="procurement">Procurement</option>
					</select>
				</div>
				<div className="flex flex-col">
					<label className="text-sm text-gray-600">Stage</label>
					<select className="border px-3 py-2 rounded" value={filters.stage ?? ''} onChange={(e) => setFilters(f => ({ ...f, stage: e.target.value || undefined }))}>
						<option value="">All</option>
						<option value="hot">Hot</option>
						<option value="warm">Warm</option>
						<option value="cold">Cold</option>
					</select>
				</div>
				<div className="flex flex-col">
					<label className="text-sm text-gray-600">Status</label>
					<select className="border px-3 py-2 rounded" value={filters.status ?? ''} onChange={(e) => setFilters(f => ({ ...f, status: e.target.value || undefined }))}>
						<option value="">All</option>
						<option value="open">Open</option>
						<option value="hold">Hold</option>
						<option value="wip">WIP</option>
						<option value="rejected">Rejected</option>
						<option value="won">Won</option>
						<option value="lost">Lost</option>
					</select>
				</div>
				<button className="bg-blue-600 text-white px-3 py-2 rounded" onClick={load}>Apply</button>
			</div>
			<form onSubmit={onAdd} className="flex gap-2">
				<input className="border px-3 py-2 rounded w-64" placeholder="Person name"
					value={name} onChange={(e) => setName(e.target.value)} />
				<button className="bg-green-600 text-white px-4 py-2 rounded">Add Lead</button>
			</form>

			{loading ? <div>Loading…</div> : (
				<table className="w-full text-left border">
					<thead>
						<tr className="bg-gray-50">
							<th className="p-2 border">ID</th>
							<th className="p-2 border">Name</th>
							<th className="p-2 border">Stage</th>
							<th className="p-2 border">Status</th>
							<th className="p-2 border">Next FU</th>
							<th className="p-2 border">Actions</th>
						</tr>
					</thead>
					<tbody>
						{leads.map((l: any) => (
							<tr key={l.id}>
								<td className="p-2 border">{l.id}</td>
								<td className="p-2 border">{l.person_name}</td>
								<td className="p-2 border">{l.stage}</td>
								<td className="p-2 border">{l.status}</td>
								<td className="p-2 border">{l.next_follow_up_at ?? '-'}</td>
								<td className="p-2 border">
									<button className="text-blue-600 underline" onClick={() => loadActivities(l)}>Timeline</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}

			{selected && (
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div className="md:col-span-2 border rounded p-4">
						<h3 className="font-semibold mb-3">Timeline: {selected.person_name}</h3>
						<ul className="space-y-3">
							{activities.map((a) => (
								<li key={a.id} className="flex gap-3 items-start">
									<div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
									<div>
										<div className="text-sm text-gray-600">{new Date(a.at).toLocaleString()} • {a.kind}</div>
										<div>{a.body || '-'}</div>
									</div>
								</li>
							))}
						</ul>
					</div>
					<form onSubmit={onAddNote} className="border rounded p-4 space-y-3">
						<h4 className="font-semibold">Add Note</h4>
						<textarea className="border w-full rounded px-3 py-2" rows={5} value={note} onChange={(e) => setNote(e.target.value)} />
						<button className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
					</form>
				</div>
			)}
		</div>
	);
}