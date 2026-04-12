'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';

// ── Pricing constants ──────────────────────────────────────────────────────────
const MATERIAL_RATES: Record<string, number> = {
  PLA: 0.15,
  ABS: 0.18,
  PETG: 0.20,
  Resin: 0.35,
};

const INFILL_OPTIONS = [
  { label: 'Light (20%)',    value: 0.20 },
  { label: 'Standard (40%)', value: 0.40 },
  { label: 'Strong (60%)',   value: 0.60 },
  { label: 'Dense (80%)',    value: 0.80 },
  { label: 'Solid (100%)',   value: 1.00 },
];

const FINISH_OPTIONS = ['Standard', 'Fine'];
const COLOR_OPTIONS   = ['Next Available', 'Black', 'White', 'Grey', 'Red', 'Blue', 'Yellow', 'Green'];

// ── Helpers ────────────────────────────────────────────────────────────────────
function signedVolumeOfTriangle(
  p1x: number, p1y: number, p1z: number,
  p2x: number, p2y: number, p2z: number,
  p3x: number, p3y: number, p3z: number,
): number {
  return (
    p1x * (p2y * p3z - p2z * p3y) -
    p1y * (p2x * p3z - p2z * p3x) +
    p1z * (p2x * p3y - p2y * p3x)
  ) / 6.0;
}

interface STLResult {
  volumeCm3: number;
  dimX: number; // mm
  dimY: number;
  dimZ: number;
  positions: Float32Array;
}

function parseSTL(buffer: ArrayBuffer): STLResult {
  // Detect ASCII vs Binary
  const headerBytes = new Uint8Array(buffer, 0, 80);
  const headerStr = String.fromCharCode(...headerBytes).trim();
  const isAscii = headerStr.startsWith('solid') && !isBinarySTL(buffer);

  let positions: Float32Array;
  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
  let volume = 0;

  if (isAscii) {
    const text = new TextDecoder().decode(buffer);
    const lines = text.split('\n');
    const verts: number[] = [];
    for (const line of lines) {
      const t = line.trim();
      if (t.startsWith('vertex')) {
        const parts = t.split(/\s+/);
        const x = parseFloat(parts[1]);
        const y = parseFloat(parts[2]);
        const z = parseFloat(parts[3]);
        verts.push(x, y, z);
        minX = Math.min(minX, x); maxX = Math.max(maxX, x);
        minY = Math.min(minY, y); maxY = Math.max(maxY, y);
        minZ = Math.min(minZ, z); maxZ = Math.max(maxZ, z);
      }
    }
    positions = new Float32Array(verts);
    for (let i = 0; i < positions.length; i += 9) {
      volume += signedVolumeOfTriangle(
        positions[i],   positions[i+1], positions[i+2],
        positions[i+3], positions[i+4], positions[i+5],
        positions[i+6], positions[i+7], positions[i+8],
      );
    }
  } else {
    // Binary STL: 80-byte header, 4-byte count, then 50 bytes per triangle
    const view  = new DataView(buffer);
    const count = view.getUint32(80, true);
    const verts: number[] = [];
    for (let i = 0; i < count; i++) {
      const base = 84 + i * 50 + 12; // skip normal (12 bytes)
      const coords: number[] = [];
      for (let v = 0; v < 3; v++) {
        const x = view.getFloat32(base + v * 12,     true);
        const y = view.getFloat32(base + v * 12 + 4, true);
        const z = view.getFloat32(base + v * 12 + 8, true);
        coords.push(x, y, z);
        minX = Math.min(minX, x); maxX = Math.max(maxX, x);
        minY = Math.min(minY, y); maxY = Math.max(maxY, y);
        minZ = Math.min(minZ, z); maxZ = Math.max(maxZ, z);
      }
      verts.push(...coords);
      volume += signedVolumeOfTriangle(
        coords[0], coords[1], coords[2],
        coords[3], coords[4], coords[5],
        coords[6], coords[7], coords[8],
      );
    }
    positions = new Float32Array(verts);
  }

  const volumeMm3 = Math.abs(volume);
  const volumeCm3 = volumeMm3 / 1000;

  return {
    volumeCm3,
    dimX: maxX - minX,
    dimY: maxY - minY,
    dimZ: maxZ - minZ,
    positions,
  };
}

function isBinarySTL(buffer: ArrayBuffer): boolean {
  if (buffer.byteLength < 84) return false;
  const view  = new DataView(buffer);
  const count = view.getUint32(80, true);
  return buffer.byteLength === 84 + count * 50;
}

// ── 3D Viewer ──────────────────────────────────────────────────────────────────
function STLViewer({ positions }: { positions: Float32Array }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef  = useRef<{
    renderer: unknown; animId: number;
  } | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !positions) return;

    let THREE: typeof import('three');
    let animId: number;

    import('three').then((mod) => {
      THREE = mod;
      const canvas   = canvasRef.current!;
      const width    = canvas.clientWidth  || 400;
      const height   = canvas.clientHeight || 340;

      // Scene
      const scene    = new THREE.Scene();
      scene.background = new THREE.Color(0xf5f5f5);

      // Camera
      const camera   = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);

      // Renderer
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);

      // Lights
      scene.add(new THREE.AmbientLight(0xffffff, 0.6));
      const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
      dirLight.position.set(1, 2, 3);
      scene.add(dirLight);

      // Geometry from parsed positions
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.computeVertexNormals();

      const material = new THREE.MeshPhongMaterial({
        color: 0x4a90d9,
        specular: 0x222222,
        shininess: 40,
        side: THREE.DoubleSide,
      });

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // Center and fit
      const box    = new THREE.Box3().setFromObject(mesh);
      const center = box.getCenter(new THREE.Vector3());
      const size   = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);

      mesh.position.sub(center);
      camera.position.set(0, 0, maxDim * 2.0);
      camera.lookAt(0, 0, 0);

      // Simple orbit via mouse drag
      let isDragging  = false;
      let prevMouseX  = 0;
      let prevMouseY  = 0;
      let rotX = 0.3;
      let rotY = 0.4;

      const pivot = new THREE.Group();
      scene.add(pivot);
      pivot.add(mesh);

      const onMouseDown = (e: MouseEvent) => { isDragging = true; prevMouseX = e.clientX; prevMouseY = e.clientY; };
      const onMouseUp   = ()              => { isDragging = false; };
      const onMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        rotY += (e.clientX - prevMouseX) * 0.01;
        rotX += (e.clientY - prevMouseY) * 0.01;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      };
      const onWheel = (e: WheelEvent) => {
        camera.position.z = Math.max(maxDim * 0.5, camera.position.z + e.deltaY * 0.1);
      };

      canvas.addEventListener('mousedown', onMouseDown);
      window.addEventListener('mouseup',   onMouseUp);
      window.addEventListener('mousemove', onMouseMove);
      canvas.addEventListener('wheel',     onWheel, { passive: true });

      // Animate
      const animate = () => {
        animId = requestAnimationFrame(animate);
        pivot.rotation.x = rotX;
        pivot.rotation.y = rotY;
        renderer.render(scene, camera);
      };
      animate();

      sceneRef.current = { renderer, animId };

      return () => {
        cancelAnimationFrame(animId);
        canvas.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mouseup',   onMouseUp);
        window.removeEventListener('mousemove', onMouseMove);
        canvas.removeEventListener('wheel',     onWheel);
        renderer.dispose();
      };
    });

    return () => {
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animId);
      }
    };
  }, [positions]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full rounded-xl"
      style={{ touchAction: 'none' }}
    />
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function PrintingPage() {
  const [file,      setFile]      = useState<File | null>(null);
  const [stlData,   setStlData]   = useState<STLResult | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading,  setIsLoading]  = useState(false);
  const [error,      setError]      = useState('');

  const [quantity,  setQuantity]  = useState(1);
  const [material,  setMaterial]  = useState('PLA');
  const [infill,    setInfill]    = useState(0.40);
  const [finish,    setFinish]    = useState('Standard');
  const [color,     setColor]     = useState('Next Available');
  const [turnaround, setTurnaround] = useState<'standard' | 'express'>('standard');

  // ── Price calculation ──────────────────────────────────────────────────────
  const unitPrice = stlData
    ? stlData.volumeCm3 * infill * MATERIAL_RATES[material] * (turnaround === 'express' ? 1.3 : 1.0)
    : 0;
  const totalPrice = unitPrice * quantity;

  // ── File processing ────────────────────────────────────────────────────────
  const processFile = useCallback(async (f: File) => {
    if (!f.name.toLowerCase().endsWith('.stl')) {
      setError('Please upload an STL file.');
      return;
    }
    setError('');
    setIsLoading(true);
    setFile(f);
    try {
      const buffer = await f.arrayBuffer();
      const result = parseSTL(buffer);
      setStlData(result);
    } catch {
      setError('Could not parse STL file. Please try another file.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) processFile(f);
  }, [processFile]);

  const onFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) processFile(f);
  }, [processFile]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      {/* ── Page header ─────────────────────────────────────────────── */}
      <div className="bg-[#111111] text-white py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
            <Link href="/" className="hover:text-[#F5C100] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/build-with-us" className="hover:text-[#F5C100] transition-colors">Build With Us</Link>
            <span>/</span>
            <span className="text-white">3D Printing</span>
          </div>
          <h1 className="text-3xl font-extrabold mb-2">
            3D Printing <span className="text-[#F5C100]">Instant Quote</span>
          </h1>
          <p className="text-gray-400 text-sm max-w-xl">
            Upload your STL file and get a real-time price in seconds. FDM printing shipped from India to the US &amp; EU.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── LEFT PANEL ──────────────────────────────────────────── */}
          <div className="lg:w-[40%] flex flex-col gap-4">

            {/* 3D Viewer / Upload zone */}
            <div className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden">
              {stlData ? (
                <div>
                  <div className="h-72 relative">
                    <STLViewer positions={stlData.positions} />
                    <button
                      onClick={() => { setStlData(null); setFile(null); }}
                      className="absolute top-3 right-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-500 rounded-lg p-1.5 shadow-sm transition-colors"
                      title="Remove file"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-gray-500">
                      🖱️ Click &amp; drag to rotate · Scroll to zoom
                    </div>
                  </div>
                  {/* Dimensions */}
                  <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                    <p className="text-xs text-gray-400 mb-1 font-semibold uppercase tracking-wide">Dimensions</p>
                    <p className="text-sm text-[#111111] font-mono">
                      {stlData.dimX.toFixed(2)} × {stlData.dimY.toFixed(2)} × {stlData.dimZ.toFixed(2)} mm
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Volume: <span className="text-[#111111] font-semibold">{stlData.volumeCm3.toFixed(3)} cm³</span>
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  className={`h-80 flex flex-col items-center justify-center p-8 cursor-pointer transition-all ${isDragOver ? 'bg-[#FEF9E7] border-[#F5C100]' : 'bg-gray-50'}`}
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={onDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isLoading ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 border-4 border-[#F5C100] border-t-transparent rounded-full animate-spin" />
                      <p className="text-sm text-gray-500">Analysing file…</p>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-[#F5C100]/10 rounded-2xl flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#F5C100]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                      </div>
                      <p className="text-[#111111] font-bold text-base mb-1">
                        Drag &amp; drop your STL file
                      </p>
                      <p className="text-gray-400 text-sm text-center mb-4">
                        or click to browse
                      </p>
                      <div className="inline-flex items-center gap-2 bg-[#111111] text-white text-sm font-bold px-5 py-2.5 rounded-lg hover:bg-[#333] transition-colors">
                        Choose File
                      </div>
                      <p className="text-gray-400 text-xs mt-4">Accepts .stl · Max 100 MB</p>
                    </>
                  )}
                  {error && <p className="mt-3 text-red-500 text-sm">{error}</p>}
                </div>
              )}
            </div>

            {/* File name chip */}
            {file && (
              <div className="bg-white border-2 border-gray-100 rounded-xl px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#F5C100]/15 rounded-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#111111]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#111111] truncate max-w-[200px]">{file.name}</p>
                    <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">✓ Loaded</span>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".stl"
              className="hidden"
              onChange={onFileInput}
            />
          </div>

          {/* ── RIGHT PANEL ─────────────────────────────────────────── */}
          <div className="lg:w-[60%] flex flex-col gap-4">

            {/* Live price box */}
            <div className={`rounded-2xl p-6 flex items-center justify-between transition-all ${stlData ? 'bg-[#F5C100]' : 'bg-gray-200'}`}>
              <div>
                <p className={`text-sm font-semibold mb-0.5 ${stlData ? 'text-[#111111]' : 'text-gray-400'}`}>
                  {stlData ? 'Estimated Total' : 'Upload a file to get your price'}
                </p>
                {stlData && (
                  <p className="text-xs text-[#333333]">
                    {stlData.volumeCm3.toFixed(3)} cm³ × {(infill * 100).toFixed(0)}% infill × ${MATERIAL_RATES[material]}/cm³ × {quantity} unit{quantity > 1 ? 's' : ''}
                    {turnaround === 'express' ? ' × 1.3 express' : ''}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className={`text-3xl font-extrabold ${stlData ? 'text-[#111111]' : 'text-gray-400'}`}>
                  {stlData ? `$${totalPrice.toFixed(2)}` : '—'}
                </p>
                {stlData && quantity > 1 && (
                  <p className="text-xs text-[#333333]">${unitPrice.toFixed(2)} per unit</p>
                )}
              </div>
            </div>

            {/* Part properties card */}
            <div className="bg-white border-2 border-gray-100 rounded-2xl p-6">
              <h2 className="text-[#111111] font-bold text-lg mb-5">Part Properties</h2>

              <div className="space-y-5">

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-semibold text-[#111111] mb-1.5">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    max={9999}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-40 border-2 border-gray-200 focus:border-[#F5C100] rounded-lg px-3 py-2.5 text-sm text-[#111111] outline-none transition-colors"
                  />
                </div>

                {/* Material */}
                <div>
                  <label className="block text-sm font-semibold text-[#111111] mb-1.5">Material</label>
                  <select
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    className="w-full border-2 border-gray-200 focus:border-[#F5C100] rounded-lg px-3 py-2.5 text-sm text-[#111111] outline-none transition-colors bg-white"
                  >
                    {Object.entries(MATERIAL_RATES).map(([mat, rate]) => (
                      <option key={mat} value={mat}>
                        {mat} — ${rate.toFixed(2)}/cm³
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-400 mt-1">
                    {material === 'PLA' && 'Great for prototypes and hobby use. Biodegradable, easy to print.'}
                    {material === 'ABS' && 'Tough and heat-resistant. Ideal for functional parts and enclosures.'}
                    {material === 'PETG' && 'Best of both worlds — strong, slightly flexible, moisture resistant.'}
                    {material === 'Resin' && 'Ultra-fine detail and smooth surface. Perfect for miniatures and precision parts.'}
                  </p>
                </div>

                {/* Infill */}
                <div>
                  <label className="block text-sm font-semibold text-[#111111] mb-1.5">Infill</label>
                  <select
                    value={infill}
                    onChange={(e) => setInfill(parseFloat(e.target.value))}
                    className="w-full border-2 border-gray-200 focus:border-[#F5C100] rounded-lg px-3 py-2.5 text-sm text-[#111111] outline-none transition-colors bg-white"
                  >
                    {INFILL_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-400 mt-1">Higher infill = stronger part, more material used, higher price.</p>
                </div>

                {/* Finish */}
                <div>
                  <label className="block text-sm font-semibold text-[#111111] mb-1.5">Finish</label>
                  <div className="flex gap-3">
                    {FINISH_OPTIONS.map((f) => (
                      <button
                        key={f}
                        onClick={() => setFinish(f)}
                        className={`flex-1 border-2 rounded-lg py-2.5 text-sm font-semibold transition-all ${finish === f ? 'border-[#F5C100] bg-[#FEF9E7] text-[#111111]' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Fine finish adds light sanding for a smoother surface. No price difference.</p>
                </div>

                {/* Color */}
                <div>
                  <label className="block text-sm font-semibold text-[#111111] mb-1.5">Color</label>
                  <select
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full border-2 border-gray-200 focus:border-[#F5C100] rounded-lg px-3 py-2.5 text-sm text-[#111111] outline-none transition-colors bg-white"
                  >
                    {COLOR_OPTIONS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Turnaround */}
                <div>
                  <label className="block text-sm font-semibold text-[#111111] mb-1.5">Turnaround Time</label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setTurnaround('standard')}
                      className={`flex-1 border-2 rounded-lg p-3 text-left transition-all ${turnaround === 'standard' ? 'border-[#F5C100] bg-[#FEF9E7]' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <p className={`text-sm font-bold ${turnaround === 'standard' ? 'text-[#111111]' : 'text-gray-600'}`}>Standard</p>
                      <p className={`text-xs ${turnaround === 'standard' ? 'text-[#333]' : 'text-gray-400'}`}>7–10 business days</p>
                      <p className={`text-xs font-semibold mt-1 ${turnaround === 'standard' ? 'text-[#111111]' : 'text-gray-400'}`}>Base price</p>
                    </button>
                    <button
                      onClick={() => setTurnaround('express')}
                      className={`flex-1 border-2 rounded-lg p-3 text-left transition-all ${turnaround === 'express' ? 'border-[#F5C100] bg-[#FEF9E7]' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className={`text-sm font-bold ${turnaround === 'express' ? 'text-[#111111]' : 'text-gray-600'}`}>Express</p>
                        <span className="text-xs bg-[#F5C100] text-[#111111] font-bold px-1.5 py-0.5 rounded">+30%</span>
                      </div>
                      <p className={`text-xs ${turnaround === 'express' ? 'text-[#333]' : 'text-gray-400'}`}>3–5 business days</p>
                      <p className={`text-xs font-semibold mt-1 ${turnaround === 'express' ? 'text-[#111111]' : 'text-gray-400'}`}>Priority queue</p>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <button
              disabled={!stlData}
              className={`w-full py-4 rounded-xl font-bold text-base transition-all ${stlData ? 'bg-[#111111] hover:bg-[#333333] text-white cursor-pointer' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            >
              {stlData ? `Place Order — $${totalPrice.toFixed(2)}` : 'Upload a file to continue'}
            </button>

            <p className="text-center text-xs text-gray-400">
              Need help? <Link href="/support" className="text-[#111111] font-semibold underline hover:text-[#F5C100] transition-colors">Contact our team</Link> · Orders reviewed within 24 hrs after placement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
