'use client';

import { useState } from 'react';
import Draggable from 'react-draggable';
import { Rnd } from 'react-rnd';

const colors = [
  '#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231',
  '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe',
  '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000'
];

const Input = ({ label, ...props }) => (
  <div className="flex flex-col text-sm">
    <label className="mb-1">{label}</label>
    <input {...props} className="border rounded p-2 w-full" />
  </div>
);

const Button = (props) => (
  <button {...props} className="px-4 py-2 bg-blue-600 text-white rounded" />
);

const Select = ({ value, onChange, options }) => (
  <div className="flex flex-col text-sm">
    <label className="mb-1">Box 6 - Diagram</label>
    <select value={value} onChange={(e) => onChange(e.target.value)} className="border rounded p-2 w-full">
      <option value="">Select a diagram</option>
      {options.map((opt, i) => (
        <option key={i} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

export default function RigJBDBuilder() {
  const [operation, setOperation] = useState('');
  const [rig, setRig] = useState('');
  const [pic, setPic] = useState('');
  const [lofHazard, setLofHazard] = useState('');
  const [workerName, setWorkerName] = useState('');
  const [workers, setWorkers] = useState([]);
  const [positions, setPositions] = useState({});
  const [diagram, setDiagram] = useState('');
  const [stepBack, setStepBack] = useState(false);
  const [stepBackArea, setStepBackArea] = useState({ width: 100, height: 100, x: 0, y: 0 });
  const [pdfUrl, setPdfUrl] = useState('');

  const handleAddWorker = () => {
    if (workerName.trim()) {
      setWorkers([...workers, workerName]);
      setWorkerName('');
    }
  };

  const updatePosition = (index, data) => {
    setPositions({ ...positions, [index]: { x: data.x, y: data.y } });
  };

  const handleGeneratePDF = async () => {
    try {
      const res = await fetch('/api/generate-jbd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation, rig, pic, lofHazard, workers })
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    }
  };

  return (
    <div className="space-y-4 w-[1123px] h-[794px] border-2 border-black p-4 overflow-auto">
      <div className="flex space-x-2 mb-2">
        <Input label="Box 1 - OPERATION" value={operation} onChange={(e) => setOperation(e.target.value)} />
        <Input label="Box 2 - RIG" value={rig} onChange={(e) => setRig(e.target.value)} />
        <Input label="Box 3 - PIC" value={pic} onChange={(e) => setPic(e.target.value)} />
      </div>
      <Input label="Box 4 - LINE OF FIRE HAZARD" value={lofHazard} onChange={(e) => setLofHazard(e.target.value)} />

      <div className="flex space-x-2 items-end">
        <Input label="Box 5 - Add Personnel" value={workerName} onChange={(e) => setWorkerName(e.target.value)} />
        <Button onClick={handleAddWorker}>Add</Button>
      </div>

      <div className="flex space-x-4 h-[300px]">
        <div className="w-[300px] h-full border-2 border-black relative">
          <p className="text-sm font-bold p-1">Box 5 - Personnel Circles</p>
          {workers.map((w, i) => (
            <Draggable key={i} position={positions[i] || { x: 10 * i, y: 10 * i }} onStop={(e, data) => updatePosition(i, data)}>
              <div
                title={w}
                className="absolute w-8 h-8 rounded-full text-white text-xs flex items-center justify-center cursor-move z-10"
                style={{ backgroundColor: colors[i % colors.length] }}
              >
                {i + 1}
              </div>
            </Draggable>
          ))}
        </div>
        <div className="w-[700px] h-full border-2 border-black relative overflow-hidden">
          <p className="text-sm font-bold p-1">Box 6 - Diagram Area</p>
          <Select value={diagram} onChange={setDiagram} options={['Drillfloor', 'Helideck', 'Deck']} />
          {diagram && (
            <div className="relative w-full h-[240px] mt-2">
              <img src={`/${diagram}.png`} alt={diagram} className="absolute w-full h-full object-contain" />
              {stepBack && (
                <Rnd
                  size={{ width: stepBackArea.width, height: stepBackArea.height }}
                  position={{ x: stepBackArea.x, y: stepBackArea.y }}
                  onDragStop={(e, d) => setStepBackArea({ ...stepBackArea, x: d.x, y: d.y })}
                  onResizeStop={(e, direction, ref, delta, position) => {
                    setStepBackArea({
                      width: parseInt(ref.style.width),
                      height: parseInt(ref.style.height),
                      ...position
                    });
                  }}
                  style={{ border: '2px dashed green', backgroundColor: 'rgba(0,255,0,0.1)', zIndex: 2 }}
                />
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <label>
          <input type="checkbox" checked={stepBack} onChange={() => setStepBack(!stepBack)} /> Add Step Back Area
        </label>
        <Button onClick={handleGeneratePDF}>Export PDF Preview</Button>
      </div>

      {pdfUrl && (
        <iframe src={pdfUrl} title="PDF Preview" className="w-full h-[400px] border mt-2" />
      )}
    </div>
  );
}
