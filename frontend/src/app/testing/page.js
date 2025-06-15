'use client';

import { useState, useEffect } from 'react';

export default function TestingPage() {
  /* ---------- auth + search state ---------- */
  const [onlineID, setOnlineID] = useState('');
  const [password, setPassword] = useState('');
  const [response, setResponse] = useState('');

  const [search, setSearch] = useState('');
  const [classResults, setClassResults] = useState([]);

    /* ---------- remove class state---------- */
  const [removeScheduleID, setRemoveScheduleID] = useState('');
  const [removeClassUUID, setRemoveClassUUID] = useState('');
  const [removeResp, setRemoveResp] = useState('');

  /* ---------- schedule-creation state ---------- */
  const [schedName, setSchedName] = useState('');
  const [semester, setSemester] = useState('');
  const [year, setYear] = useState('');
  const [schedResp, setSchedResp] = useState('');

  const [renameID, setRenameID] = useState('');
  const [newSchedName, setNewSchedName] = useState('');
  const [renameResp, setRenameResp] = useState('');

  /* ---------- getClassInfo tester state ---------- */
  const [term, setTerm] = useState('4259');
  const [classResp, setClassResp] = useState('');

  /* ---------- addClass tester state ---------- */
  const [scheduleidAddClass, setScheduleidAddClass] = useState('');
  const [classidAddClass, setClassidAddClass] = useState('');
  const [uuidAddClass, setUuidAddClass] = useState('');
  const [addClassResp, setAddClassResp] = useState('');

  /* ---------- updateClass tester state ---------- */
  const [updateScheduleid, setUpdateScheduleid] = useState('');
  const [oldClassid, setOldClassid] = useState('');
  const [newClassid, setNewClassid] = useState('');
  const [oldUuid, setOldUuid] = useState('');
  const [newUuid, setNewUuid] = useState('');
  const [updateClassResp, setUpdateClassResp] = useState('');

  /* ---------- getSchedules tester state ---------- */
  const [getschedulesOnlineID, setGetschedulesOnlineID] = useState('');
  const [getSchedulesResp, setGetSchedulesResp] = useState('');

  /* ---------- live-class search debounce ---------- */
  useEffect(() => {
    const delay = setTimeout(() => {
      if (!search.trim()) {
        setClassResults([]);
        return;
      }
      fetch('/api/searchclass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: search }),
      })
        .then((r) => r.json())
        .then((d) => setClassResults(d || []))
        .catch(() => setClassResults([]));
    }, 300);
    return () => clearTimeout(delay);
  }, [search]);

  /* ---------- helpers ---------- */
  const callAPI = async (endpoint, bodyObj, setFn) => {
    const r = await fetch(`/api/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyObj),
    });
    const d = await r.json();
    setFn(JSON.stringify(d, null, 2));
  };

  /* ---------- render ---------- */
  return (
    <div className="p-8 max-w-xl mx-auto space-y-8 text-black bg-white">
      <h1 className="text-2xl font-bold">🧪 API Testing Page</h1>

      {/* ---------- signup / login ---------- */}
      <section className="space-y-2">
        <h2 className="font-semibold text-lg">Auth tester</h2>
        <input
          className="border p-2 w-full"
          placeholder="Online ID"
          value={onlineID}
          onChange={(e) => setOnlineID(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="space-x-2">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={() => callAPI('signUp', { onlineID, password }, setResponse)}
          >
            Signup
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => callAPI('login', { onlineID, password }, setResponse)}
          >
            Login
          </button>
        </div>
        <pre className="bg-gray-100 p-3 rounded text-sm">{response}</pre>
      </section>

      <hr />

      {/* ---------- live class search ---------- */}
      <section className="space-y-2">
        <h2 className="font-semibold text-lg">🔎 Live Class Search</h2>
        <input
          className="border p-2 w-full"
          placeholder="Search class title / dept / code…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {classResults.length > 0 && (
          <ul className="border rounded shadow max-h-64 overflow-y-auto mt-2 bg-white">
            {classResults.map((c) => (
              <li key={c.uuid} className="p-2 border-b last:border-b-0">
                <strong>
                  {c.dept} {c.code}
                </strong>{' '}
                – {c.title}
              </li>
            ))}
          </ul>
        )}
      </section>

      <hr />

      {/* ---------- schedule-creation tester ---------- */}
      <section className="space-y-2">
        <h2 className="font-semibold text-lg">🗓️ Create Schedule</h2>
        <input
          className="border p-2 w-full"
          placeholder="Owner Online ID"
          value={onlineID}
          onChange={(e) => setOnlineID(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          placeholder="Schedule name (e.g. Spring Plan)"
          value={schedName}
          onChange={(e) => setSchedName(e.target.value)}
        />
        <div className="flex space-x-2">
          <input
            className="border p-2 flex-1"
            placeholder="Semester (e.g. Spring)"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
          />
          <input
            className="border p-2 w-24"
            placeholder="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </div>
        <button
          className="bg-purple-600 text-white px-4 py-2 rounded"
          onClick={() =>
            callAPI(
              'createSchedule',
              { onlineID, scheduleName: schedName, semester, year },
              setSchedResp
            )
          }
        >
          Create Schedule
        </button>
        <pre className="bg-gray-100 p-3 rounded text-sm">{schedResp}</pre>
      </section>

      {/* ---------- schedule rename tester ---------- */}
      <section className="space-y-2">
        <h2 className="font-semibold text-lg">✏️ Rename Schedule</h2>
        <input
          className="border p-2 w-full"
          placeholder="Schedule ID"
          value={renameID}
          onChange={(e) => setRenameID(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          placeholder="New Schedule Name"
          value={newSchedName}
          onChange={(e) => setNewSchedName(e.target.value)}
        />
        <button
          className="bg-yellow-500 text-white px-4 py-2 rounded"
          onClick={() =>
            callAPI(
              'schedulenamechange',
              { scheduleid: renameID, newScheduleName: newSchedName },
              setRenameResp
            )
          }
        >
          Rename Schedule
        </button>
        <pre className="bg-gray-100 p-3 rounded text-sm">{renameResp}</pre>
      </section>

      <hr />

      {/* ---------- getClassInfo tester ---------- */}
      <section className="space-y-2">
        <h2 className="font-semibold text-lg">📚 Get Class Info</h2>
        <input
          className="border p-2 w-full"
          placeholder="Subject (e.g. EECS 212)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          placeholder="Term (e.g. 4259)"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded"
          onClick={() =>
            callAPI('getClassInfo', { subject: search, term }, setClassResp)
          }
        >
          Fetch Class Info
        </button>
        <pre className="bg-gray-100 p-3 rounded text-sm whitespace-pre-wrap break-words max-h-96 overflow-y-auto">
          {classResp}
        </pre>
      </section>

      {/* ---------- addClass tester ---------- */}
      <section className="space-y-2">
        <h2 className="font-semibold text-lg">➕ Add Class to Schedule</h2>
        <input
          className="border p-2 w-full"
          placeholder="Schedule ID"
          value={scheduleidAddClass}
          onChange={(e) => setScheduleidAddClass(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          placeholder="Class ID"
          value={classidAddClass}
          onChange={(e) => setClassidAddClass(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          placeholder="UUID"
          value={uuidAddClass}
          onChange={(e) => setUuidAddClass(e.target.value)}
        />
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={() =>
            callAPI(
              'addClass',
              { scheduleid: scheduleidAddClass, classid: classidAddClass, uuid: uuidAddClass },
              setAddClassResp
            )
          }
        >
          Add Class
        </button>
        <pre className="bg-gray-100 p-3 rounded text-sm whitespace-pre-wrap break-words max-h-96 overflow-y-auto">
          {addClassResp}
        </pre>
      </section>

      {/* ---------- remove class from schedule ---------- */}
      <section className="space-y-2">
        <h2 className="font-semibold text-lg">➖ Remove Class from Schedule</h2>
      <input
        className="border p-2 w-full"
        placeholder="Schedule ID (uuid)"
        value={removeScheduleID}
        onChange={(e) => setRemoveScheduleID(e.target.value)}
      />
      <input
        className="border p-2 w-full"
        placeholder="Class UUID (from allclasses)"
        value={removeClassUUID}
        onChange={(e) => setRemoveClassUUID(e.target.value)}
      />
      <button
        className="bg-red-600 text-white px-4 py-2 rounded"
        onClick={() =>
          callAPI(
            'removeClass',
            {
              scheduleid: removeScheduleID,
              uuid: removeClassUUID,
            },
            setRemoveResp
          )
        }
      >
        Remove Class
      </button>
      <pre className="bg-gray-100 p-3 rounded text-sm">{removeResp}</pre>
      </section>

      {/* ---------- updateClass tester ---------- */}
      <section className="space-y-2">
        <h2 className="font-semibold text-lg">✏️ Update Class in Schedule</h2>
        <input
          className="border p-2 w-full"
          placeholder="Schedule ID"
          value={updateScheduleid}
          onChange={(e) => setUpdateScheduleid(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          placeholder="Old Class ID"
          value={oldClassid}
          onChange={(e) => setOldClassid(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          placeholder="New Class ID"
          value={newClassid}
          onChange={(e) => setNewClassid(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          placeholder="Old UUID"
          value={oldUuid}
          onChange={(e) => setOldUuid(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          placeholder="New UUID"
          value={newUuid}
          onChange={(e) => setNewUuid(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() =>
            callAPI(
              'updateClass',
              {
                scheduleid: updateScheduleid,
                oldClassid,
                newClassid,
                oldUuid,
                newUuid,
              },
              setUpdateClassResp
            )
          }
        >
          Update Class
        </button>
        <pre className="bg-gray-100 p-3 rounded text-sm whitespace-pre-wrap break-words max-h-96 overflow-y-auto">
          {updateClassResp}
        </pre>
      </section>

      {/* ---------- getSchedules tester ---------- */}
      <section className="space-y-2">
        <h2 className="font-semibold text-lg">📅 Get Schedules</h2>
        <input
          className="border p-2 w-full"
          placeholder="Online ID: rand"
          value={getschedulesOnlineID}
          onChange={(e) => setGetschedulesOnlineID(e.target.value)}
        />
        <button
          className="bg-purple-600 text-white px-4 py-2 rounded"
          onClick={() =>
            callAPI(
              'getSchedules',
              { onlineID: getschedulesOnlineID },
              setGetSchedulesResp
            )
          }
        >
          Fetch Schedules
        </button>
        <pre className="bg-gray-100 p-3 rounded text-sm whitespace-pre-wrap break-words max-h-96 overflow-y-auto">
          {getSchedulesResp}
        </pre>
      </section>

    </div>
  );
}