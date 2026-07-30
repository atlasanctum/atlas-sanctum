import React, { useState, useRef } from 'react';
import { Users, Video, MessageSquare, Download, Share2, Clock, MousePointer, Undo, Redo } from 'lucide-react';

interface Participant {
  id: string;
  name: string;
  avatar: string;
  color: string;
  cursor: { x: number; y: number } | null;
  online: boolean;
}

interface Comment {
  id: string;
  user: string;
  text: string;
  x: number;
  y: number;
  timestamp: Date;
}

interface DrawElement {
  type: 'rect' | 'circle' | 'line' | 'text' | 'sticky';
  x: number;
  y: number;
  width?: number;
  height?: number;
  text?: string;
  color: string;
  user: string;
}

export function CollaborativeCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [tool, setTool] = useState<'select' | 'rect' | 'circle' | 'text' | 'sticky'>('select');
  const [color, setColor] = useState('#3B82F6');
  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: '1',
      name: 'You',
      avatar: '👤',
      color: '#3B82F6',
      cursor: null,
      online: true,
    },
    {
      id: '2',
      name: 'Sarah Chen',
      avatar: '👩',
      color: '#10B981',
      cursor: { x: 450, y: 320 },
      online: true,
    },
    {
      id: '3',
      name: 'Alex Kumar',
      avatar: '👨',
      color: '#F59E0B',
      cursor: { x: 650, y: 180 },
      online: true,
    },
  ]);

  const [elements, setElements] = useState<DrawElement[]>([
    {
      type: 'sticky',
      x: 100,
      y: 100,
      width: 200,
      height: 150,
      text: 'Q1 Carbon Goals:\n• 15K tons offset\n• 3 new projects\n• Community engagement +40%',
      color: '#FEF3C7',
      user: 'Sarah Chen',
    },
    {
      type: 'sticky',
      x: 350,
      y: 100,
      width: 200,
      height: 150,
      text: 'Challenges:\n• Budget constraints\n• Weather dependency\n• Partner coordination',
      color: '#FECACA',
      user: 'Alex Kumar',
    },
    {
      type: 'sticky',
      x: 600,
      y: 100,
      width: 200,
      height: 150,
      text: 'Solutions:\n• Diversify funding\n• IoT monitoring\n• Weekly sync calls',
      color: '#D1FAE5',
      user: 'You',
    },
  ]);

  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      user: 'Sarah Chen',
      text: 'Should we increase the Q1 target?',
      x: 300,
      y: 250,
      timestamp: new Date(Date.now() - 5 * 60000),
    },
  ]);

  const [videoEnabled, setVideoEnabled] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const tools = [
    { id: 'select', icon: MousePointer, label: 'Select' },
    { id: 'sticky', icon: MessageSquare, label: 'Sticky Note' },
    { id: 'text', icon: 'T', label: 'Text' },
    { id: 'rect', icon: '⬜', label: 'Rectangle' },
    { id: 'circle', icon: '⭕', label: 'Circle' },
  ];

  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const addElement = (e: React.MouseEvent) => {
    if (tool === 'select') return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newElement: DrawElement = {
      type: tool,
      x,
      y,
      width: tool === 'sticky' ? 200 : tool === 'rect' ? 150 : undefined,
      height: tool === 'sticky' ? 150 : tool === 'rect' ? 100 : undefined,
      text: tool === 'sticky' ? 'New note...' : tool === 'text' ? 'Text' : undefined,
      color: tool === 'sticky' ? '#FEF3C7' : color,
      user: 'You',
    };

    setElements([...elements, newElement]);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="mb-4 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl mb-2 flex items-center gap-2 sm:gap-3">
          <Users className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
          Real-Time Collaborative Canvas
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Figma-style workspace for collaborative planning and brainstorming
        </p>
      </div>

      {/* Collaboration Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-4 sm:p-6 text-white">
        <div className="flex items-start gap-3">
          <Users className="w-6 h-6 flex-shrink-0" />
          <div>
            <h3 className="text-base sm:text-lg mb-2">Live Collaboration Active</h3>
            <p className="text-sm opacity-90 mb-3">
              3 participants are editing this canvas in real-time. All changes sync instantly using CRDT technology (Conflict-Free Replicated Data Types).
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-white/20 rounded text-xs">Yjs CRDT</span>
              <span className="px-3 py-1 bg-white/20 rounded text-xs">WebRTC P2P</span>
              <span className="px-3 py-1 bg-white/20 rounded text-xs">Live Cursors</span>
              <span className="px-3 py-1 bg-white/20 rounded text-xs">Version History</span>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-3 border-b border-gray-200 flex flex-wrap items-center gap-3">
          {/* Tools */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
            {tools.map((t) => (
              <button
                key={t.id}
                onClick={() => setTool(t.id as any)}
                className={`p-2 rounded transition-colors ${
                  tool === t.id
                    ? 'bg-white shadow-sm text-purple-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title={t.label}
              >
                {typeof t.icon === 'string' ? (
                  <span className="text-sm">{t.icon}</span>
                ) : (
                  <t.icon className="w-4 h-4" />
                )}
              </button>
            ))}
          </div>

          {/* Colors */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-6 h-6 rounded transition-all ${
                  color === c ? 'ring-2 ring-offset-1 ring-purple-600' : ''
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-1 ml-auto">
            <button className="p-2 hover:bg-gray-100 rounded" title="Undo">
              <Undo className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded" title="Redo">
              <Redo className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => setVideoEnabled(!videoEnabled)}
              className={`p-2 rounded ${
                videoEnabled ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-100 text-gray-600'
              }`}
              title="Video Call"
            >
              <Video className="w-4 h-4" />
            </button>
            <button
              onClick={() => setChatOpen(!chatOpen)}
              className={`p-2 rounded ${
                chatOpen ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-100 text-gray-600'
              }`}
              title="Chat"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded" title="Share">
              <Share2 className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded" title="Export">
              <Download className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="relative bg-gray-50" style={{ height: '600px' }}>
          <div
            ref={canvasRef}
            className="absolute inset-0 overflow-auto"
            onMouseMove={handleMouseMove}
            onClick={addElement}
          >
            {/* Grid */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            />

            {/* Elements */}
            {elements.map((el, index) => (
              <div
                key={index}
                className="absolute cursor-move transition-shadow hover:shadow-lg group"
                style={{
                  left: el.x,
                  top: el.y,
                  width: el.width,
                  height: el.height,
                  backgroundColor: el.color,
                  border: el.type === 'sticky' ? 'none' : `2px solid ${el.color}`,
                }}
              >
                {el.type === 'sticky' && (
                  <div className="p-4 h-full">
                    <textarea
                      className="w-full h-full bg-transparent resize-none outline-none text-sm"
                      defaultValue={el.text}
                    />
                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs text-gray-500">{el.user}</span>
                    </div>
                  </div>
                )}
                {el.type === 'text' && (
                  <input
                    className="w-full bg-transparent outline-none text-sm p-2"
                    defaultValue={el.text}
                    style={{ color: el.color }}
                  />
                )}
                {el.type === 'circle' && (
                  <div
                    className="rounded-full"
                    style={{
                      width: 100,
                      height: 100,
                      border: `2px solid ${el.color}`,
                    }}
                  />
                )}
              </div>
            ))}

            {/* Comments */}
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="absolute bg-white rounded-lg shadow-lg p-3 max-w-xs border-l-4 border-purple-600"
                style={{ left: comment.x, top: comment.y }}
              >
                <div className="flex items-start gap-2 mb-1">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs">
                    {comment.user[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium">{comment.user}</p>
                    <p className="text-xs text-gray-500">
                      {Math.floor((Date.now() - comment.timestamp.getTime()) / 60000)}m ago
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-700">{comment.text}</p>
                <div className="mt-2 flex gap-2">
                  <button className="text-xs text-purple-600 hover:underline">Reply</button>
                  <button className="text-xs text-gray-500 hover:underline">Resolve</button>
                </div>
              </div>
            ))}

            {/* Participant Cursors */}
            {participants
              .filter((p) => p.cursor && p.id !== '1')
              .map((participant) => (
                <div
                  key={participant.id}
                  className="absolute pointer-events-none transition-all duration-100"
                  style={{
                    left: participant.cursor!.x,
                    top: participant.cursor!.y,
                  }}
                >
                  <MousePointer
                    className="w-5 h-5"
                    style={{ color: participant.color }}
                    fill={participant.color}
                  />
                  <div
                    className="mt-1 px-2 py-1 rounded text-xs text-white whitespace-nowrap shadow-lg"
                    style={{ backgroundColor: participant.color }}
                  >
                    {participant.name}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Participants Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <h3 className="text-sm mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-600" />
            Version History
          </h3>
          <div className="space-y-2">
            {[
              { user: 'You', action: 'Added sticky note', time: '2 min ago' },
              { user: 'Sarah Chen', action: 'Updated carbon goals', time: '5 min ago' },
              { user: 'Alex Kumar', action: 'Added challenges section', time: '8 min ago' },
            ].map((version, index) => (
              <div key={index} className="flex items-center justify-between text-xs p-2 hover:bg-gray-50 rounded">
                <div>
                  <span className="font-medium">{version.user}</span>
                  <span className="text-gray-600"> {version.action}</span>
                </div>
                <span className="text-gray-500">{version.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <h3 className="text-sm mb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-600" />
            Active Participants ({participants.filter((p) => p.online).length})
          </h3>
          <div className="space-y-2">
            {participants.map((participant) => (
              <div key={participant.id} className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                  style={{ backgroundColor: `${participant.color}20` }}
                >
                  {participant.avatar}
                </div>
                <div className="flex-1">
                  <p className="text-sm">{participant.name}</p>
                  <div className="flex items-center gap-1">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        participant.online ? 'bg-emerald-500' : 'bg-gray-300'
                      }`}
                    />
                    <span className="text-xs text-gray-500">
                      {participant.online ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Templates */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg mb-4">Canvas Templates</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Impact Planning', icon: '🎯' },
            { name: 'Brainstorming', icon: '💡' },
            { name: 'Retrospective', icon: '🔄' },
            { name: 'Roadmap', icon: '🗺️' },
          ].map((template) => (
            <button
              key={template.name}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all text-center"
            >
              <div className="text-3xl mb-2">{template.icon}</div>
              <p className="text-sm">{template.name}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}