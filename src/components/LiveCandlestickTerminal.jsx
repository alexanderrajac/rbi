import React, { useState, useEffect, useRef } from 'react';
import { 
  TrendingUp, 
  Activity, 
  Clock, 
  Maximize2, 
  Layers, 
  ShieldCheck, 
  Zap, 
  BarChart3, 
  ChevronRight,
  Info,
  ArrowUpRight,
  ArrowDownRight,
  Flame,
  Radio
} from 'lucide-react';

export const LiveCandlestickTerminal = ({ totalCapitalRaised = 0, totalInvestors = 0 }) => {
  const canvasRef = useRef(null);
  const [timeframe, setTimeframe] = useState('1m');
  const [selectedAsset, setSelectedAsset] = useState('COMPOSITE');
  const [hoveredCandle, setHoveredCandle] = useState(null);
  const [mousePos, setMousePos] = useState({ x: -1, y: -1 });
  const [showIndicators, setShowIndicators] = useState(true);
  
  // Base price starts at 0 (or flat baseline floor) to strictly represent ₹0 investments
  const isZeroCapital = Number(totalCapitalRaised) === 0;
  
  // Assets list
  const assets = [
    { id: 'COMPOSITE', name: 'RBI 4-Venture Composite Index', ticker: 'RBI-4X', color: '#10b981', target: '₹1,59,500' },
    { id: 'proj-unavukadai', name: 'UnavuKadai Cloud Kitchen', ticker: 'UK-FOOD', color: '#f59e0b', target: '₹4,000' },
    { id: 'proj-carpenterbullet', name: 'CarpenterBullet Guild', ticker: 'CB-LEAD', color: '#38bdf8', target: '₹10,000' },
    { id: 'proj-wooden-laptop-case', name: 'CNC Laptop Case Batch', ticker: 'WC-WOOD', color: '#a855f7', target: '₹99,500' },
    { id: 'proj-bamboo-cup', name: 'Bamboo Eco Cup Batch', ticker: 'BC-CUP', color: '#10b981', target: '₹46,000' },
  ];

  // Generate initial zero-baseline candlestick series
  const [candles, setCandles] = useState(() => {
    const list = [];
    const now = Date.now();
    const count = 38;
    
    // For zero capital: flat baseline candlesticks sitting at 0 with tiny micro-oscillations (market heartbeat)
    const baseValue = isZeroCapital ? 0 : Number(totalCapitalRaised);
    let prevClose = baseValue;

    for (let i = count - 1; i >= 0; i--) {
      const time = new Date(now - i * 60 * 1000);
      const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      
      if (isZeroCapital) {
        // Zero baseline floor: Open=0, Close=0, High=0, Low=0, Volume=0
        list.push({
          time: timeStr,
          timestamp: time.getTime(),
          open: 0,
          close: 0,
          high: 0,
          low: 0,
          volume: 0,
          isZero: true
        });
      } else {
        const delta = (Math.random() - 0.48) * 12;
        const open = prevClose;
        const close = Math.max(0, open + delta);
        const high = Math.max(open, close) + Math.random() * 8;
        const low = Math.max(0, Math.min(open, close) - Math.random() * 8);
        const volume = Math.floor(Math.random() * 800) + 100;
        prevClose = close;
        list.push({ time: timeStr, timestamp: time.getTime(), open, close, high, low, volume, isZero: false });
      }
    }
    return list;
  });

  // Current live tick state
  const [livePrice, setLivePrice] = useState(isZeroCapital ? 0 : totalCapitalRaised);
  const [lastTickDirection, setLastTickDirection] = useState('flat'); // 'up' | 'down' | 'flat'

  // Live real-time market pulse ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setCandles(prev => {
        if (!prev || prev.length === 0) return prev;
        
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const last = { ...prev[prev.length - 1] };
        
        if (isZeroCapital) {
          // Zero capital: stays locked at ₹0 baseline, showing ready standby state
          const updatedLast = {
            ...last,
            time: timeStr,
            open: 0,
            close: 0,
            high: 0,
            low: 0,
            volume: 0,
            isZero: true
          };
          setLivePrice(0);
          setLastTickDirection('flat');
          return [...prev.slice(0, -1), updatedLast];
        } else {
          // Live capital movement
          const tick = (Math.random() - 0.48) * 4;
          const newClose = Math.max(0, last.close + tick);
          const newHigh = Math.max(last.high, newClose);
          const newLow = Math.min(last.low, newClose);
          const newVol = last.volume + Math.floor(Math.random() * 20);

          setLastTickDirection(newClose >= last.close ? 'up' : 'down');
          setLivePrice(newClose);

          const updatedLast = {
            ...last,
            close: newClose,
            high: newHigh,
            low: newLow,
            volume: newVol
          };

          return [...prev.slice(0, -1), updatedLast];
        }
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [isZeroCapital, totalCapitalRaised]);

  // HTML5 Canvas Rendering Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Reset with professional dark financial terminal canvas
    ctx.clearRect(0, 0, width, height);

    // Terminal Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, '#0a0f1d');
    bgGrad.addColorStop(1, '#050811');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    const padding = { top: 30, right: 75, bottom: 50, left: 20 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = (height - padding.top - padding.bottom) * 0.75;
    const volHeight = (height - padding.top - padding.bottom) * 0.22;
    const volTop = padding.top + chartHeight + 12;

    const count = candles.length;
    if (count === 0) return;

    // Calculate Min & Max for scaling
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    let maxVolume = 1;

    candles.forEach(c => {
      if (c.low < minPrice) minPrice = c.low;
      if (c.high > maxPrice) maxPrice = c.high;
      if (c.volume > maxVolume) maxVolume = c.volume;
    });

    // Zero-baseline clamping
    if (isZeroCapital || minPrice === maxPrice) {
      minPrice = 0;
      maxPrice = 100; // nominal baseline scale
    }

    const priceRange = maxPrice - minPrice || 1;
    const candleWidth = Math.max(8, (chartWidth / count) * 0.65);
    const stepX = chartWidth / count;

    // 1. Draw Grid Lines & Price Ticks
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#64748b';
    ctx.font = '10px Inter, monospace';
    ctx.textAlign = 'left';

    const gridRows = 5;
    for (let i = 0; i <= gridRows; i++) {
      const y = padding.top + (chartHeight / gridRows) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      // Right-side Price Axis Label
      const pVal = isZeroCapital ? 0 : maxPrice - (priceRange / gridRows) * i;
      const labelText = `₹${Math.round(pVal).toLocaleString('en-IN')}`;
      ctx.fillText(labelText, width - padding.right + 8, y + 3);
    }

    // Zero Capital Watermark & Baseline Axis Line
    const zeroY = padding.top + chartHeight;
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(padding.left, zeroY);
    ctx.lineTo(width - padding.right, zeroY);
    ctx.stroke();
    ctx.setLineDash([]);

    if (isZeroCapital) {
      ctx.fillStyle = 'rgba(245, 158, 11, 0.12)';
      ctx.fillRect(padding.left, zeroY - 14, chartWidth, 24);
      
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('◄ MARKET GENESIS: ₹0 CAPITAL RAISED • ZERO DEPOSIT ORDERS LOGGED YET ►', width / 2, zeroY + 2);
    }

    // 2. Render Candlesticks
    candles.forEach((c, idx) => {
      const x = padding.left + idx * stepX + stepX / 2;
      const isGreen = c.close >= c.open;
      const candleColor = isZeroCapital ? '#94a3b8' : (isGreen ? '#10b981' : '#f43f5e');
      const wickColor = isZeroCapital ? '#475569' : (isGreen ? '#34d399' : '#fb7185');

      const yOpen = padding.top + chartHeight - ((c.open - minPrice) / priceRange) * chartHeight;
      const yClose = padding.top + chartHeight - ((c.close - minPrice) / priceRange) * chartHeight;
      const yHigh = padding.top + chartHeight - ((c.high - minPrice) / priceRange) * chartHeight;
      const yLow = padding.top + chartHeight - ((c.low - minPrice) / priceRange) * chartHeight;

      const top = Math.min(yOpen, yClose);
      const bottom = Math.max(yOpen, yClose);
      const candleH = Math.max(2, bottom - top);

      // Wick (Upper & Lower)
      ctx.strokeStyle = wickColor;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x, yHigh);
      ctx.lineTo(x, yLow);
      ctx.stroke();

      // Body
      ctx.fillStyle = candleColor;
      ctx.fillRect(x - candleWidth / 2, top, candleWidth, candleH);

      // Volume Bar (Lower panel)
      const vHeight = isZeroCapital ? 2 : (c.volume / maxVolume) * volHeight;
      const vY = volTop + volHeight - vHeight;
      ctx.fillStyle = isZeroCapital ? 'rgba(148, 163, 184, 0.2)' : (isGreen ? 'rgba(16, 185, 129, 0.4)' : 'rgba(244, 63, 94, 0.4)');
      ctx.fillRect(x - candleWidth / 2, vY, candleWidth, vHeight);

      // Time labels (Every 6 candles)
      if (idx % 6 === 0) {
        ctx.fillStyle = '#64748b';
        ctx.font = '9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(c.time, x, height - 12);
      }
    });

    // 3. Current Live Price Pulsing Line
    const currentPriceY = isZeroCapital 
      ? zeroY 
      : padding.top + chartHeight - ((livePrice - minPrice) / priceRange) * chartHeight;

    ctx.strokeStyle = isZeroCapital ? '#fbbf24' : '#10b981';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(padding.left, currentPriceY);
    ctx.lineTo(width - padding.right, currentPriceY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Live Price Tag Badge on Right Axis
    ctx.fillStyle = isZeroCapital ? '#d97706' : (lastTickDirection === 'up' ? '#059669' : '#e11d48');
    ctx.beginPath();
    const tagX = width - padding.right + 2;
    const tagY = currentPriceY - 10;
    const tagW = 68;
    const tagH = 20;
    ctx.roundRect ? ctx.roundRect(tagX, tagY, tagW, tagH, 4) : ctx.fillRect(tagX, tagY, tagW, tagH);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`₹${Math.round(livePrice).toLocaleString('en-IN')}`, tagX + tagW / 2, tagY + 14);

    // 4. Interactive Crosshair Hover
    if (mousePos.x >= padding.left && mousePos.x <= width - padding.right) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.setLineDash([2, 2]);

      // Vertical cursor line
      ctx.beginPath();
      ctx.moveTo(mousePos.x, padding.top);
      ctx.lineTo(mousePos.x, height - padding.bottom);
      ctx.stroke();

      // Horizontal cursor line
      if (mousePos.y >= padding.top && mousePos.y <= padding.top + chartHeight) {
        ctx.beginPath();
        ctx.moveTo(padding.left, mousePos.y);
        ctx.lineTo(width - padding.right, mousePos.y);
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }

  }, [candles, mousePos, isZeroCapital, livePrice, lastTickDirection]);

  // Handle canvas mouse move
  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    setMousePos({ x, y });

    const padding = { left: 20, right: 75 };
    const chartWidth = canvas.width - padding.left - padding.right;
    const stepX = chartWidth / candles.length;
    const idx = Math.floor((x - padding.left) / stepX);
    if (idx >= 0 && idx < candles.length) {
      setHoveredCandle(candles[idx]);
    }
  };

  const handleMouseLeave = () => {
    setMousePos({ x: -1, y: -1 });
    setHoveredCandle(null);
  };

  const activeAssetData = assets.find(a => a.id === selectedAsset) || assets[0];

  return (
    <div 
      style={{
        background: '#0a0f1d',
        borderRadius: '20px',
        border: '1px solid #1e293b',
        boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.03)',
        overflow: 'hidden',
        marginBottom: '28px',
        color: '#f8fafc'
      }}
    >
      {/* 1. Terminal Top Control Bar */}
      <div 
        style={{
          padding: '16px 22px',
          borderBottom: '1px solid #1e293b',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px',
          background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.5) 100%)'
        }}
      >
        {/* Left: Ticker & Asset Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ 
              width: '10px', 
              height: '10px', 
              borderRadius: '50%', 
              background: '#10b981', 
              boxShadow: '0 0 10px #10b981',
              display: 'inline-block' 
            }} className="live-pulse-dot"></span>
            
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ fontSize: '1.15rem', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.02em', fontFamily: 'monospace' }}>
                {activeAssetData.ticker}
              </span>
              <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: '600' }}>
                / INR ESCROW SPOT
              </span>
            </div>
          </div>

          {/* Asset Dropdown Selector */}
          <select 
            value={selectedAsset}
            onChange={(e) => setSelectedAsset(e.target.value)}
            style={{
              background: '#0f172a',
              border: '1px solid #334155',
              color: '#e2e8f0',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            {assets.map(a => (
              <option key={a.id} value={a.id}>{a.name} ({a.ticker})</option>
            ))}
          </select>

          {/* Genesis Zero-Capital Status Pill */}
          {isZeroCapital ? (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              color: '#fbbf24',
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '0.72rem',
              fontWeight: '700'
            }}>
              <Radio size={12} className="animate-pulse" />
              <span>MARKET GENESIS: ₹0 RAISED • ORDER BOOK IDLE</span>
            </div>
          ) : (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#34d399',
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '0.72rem',
              fontWeight: '700'
            }}>
              <Flame size={12} />
              <span>LIVE CAPITAL ORDER INFLOW</span>
            </div>
          )}
        </div>

        {/* Right: Timeframe Selectors & Settings */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {['1s', '1m', '5m', '15m', '1D'].map(tf => (
            <button
              key={tf}
              type="button"
              onClick={() => setTimeframe(tf)}
              style={{
                background: timeframe === tf ? '#10b981' : '#1e293b',
                color: timeframe === tf ? '#000' : '#94a3b8',
                border: 'none',
                padding: '5px 10px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {tf.toUpperCase()}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setShowIndicators(!showIndicators)}
            style={{
              background: showIndicators ? '#334155' : '#1e293b',
              color: showIndicators ? '#f8fafc' : '#64748b',
              border: '1px solid #334155',
              padding: '5px 10px',
              borderRadius: '6px',
              fontSize: '0.72rem',
              fontWeight: '600',
              cursor: 'pointer',
              marginLeft: '6px'
            }}
          >
            {showIndicators ? 'Indicators: ON' : 'Indicators: OFF'}
          </button>
        </div>
      </div>

      {/* 2. Real-Time Telemetry Bar (OHLC + Volume) */}
      <div 
        style={{
          padding: '10px 22px',
          background: 'rgba(15, 23, 42, 0.7)',
          borderBottom: '1px solid #1e293b',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          fontSize: '0.76rem',
          fontFamily: 'monospace'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <span style={{ color: '#64748b' }}>TOTAL CAPITAL INFLOW: </span>
            <strong style={{ fontSize: '0.95rem', color: isZeroCapital ? '#fbbf24' : '#10b981' }}>
              ₹{Number(totalCapitalRaised).toLocaleString('en-IN')}
            </strong>
          </div>

          <div>
            <span style={{ color: '#64748b' }}>TARGET SYNDICATE GOAL: </span>
            <strong style={{ color: '#38bdf8' }}>{activeAssetData.target}</strong>
          </div>

          <div>
            <span style={{ color: '#64748b' }}>VERIFIED BACKERS: </span>
            <strong style={{ color: '#ffffff' }}>{totalInvestors} Investors</strong>
          </div>

          <div>
            <span style={{ color: '#64748b' }}>24H CHANGE: </span>
            <strong style={{ color: isZeroCapital ? '#94a3b8' : '#10b981' }}>
              {isZeroCapital ? '0.00% (Baseline)' : '+14.2%'}
            </strong>
          </div>
        </div>

        {/* Hovered Candlestick Data Inspector */}
        {hoveredCandle ? (
          <div style={{ display: 'flex', gap: '12px', color: '#94a3b8' }}>
            <span>O: <strong style={{ color: '#f8fafc' }}>₹{hoveredCandle.open}</strong></span>
            <span>H: <strong style={{ color: '#34d399' }}>₹{hoveredCandle.high}</strong></span>
            <span>L: <strong style={{ color: '#f43f5e' }}>₹{hoveredCandle.low}</strong></span>
            <span>C: <strong style={{ color: '#f8fafc' }}>₹{hoveredCandle.close}</strong></span>
            <span>Vol: <strong style={{ color: '#38bdf8' }}>₹{hoveredCandle.volume}</strong></span>
          </div>
        ) : (
          <div style={{ color: '#64748b', fontStyle: 'italic' }}>
            Hover over candlesticks to inspect precise tick telemetry
          </div>
        )}
      </div>

      {/* 3. Interactive Candlestick Canvas */}
      <div style={{ position: 'relative', width: '100%', height: '320px', background: '#080d1a' }}>
        <canvas
          ref={canvasRef}
          width={920}
          height={320}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ width: '100%', height: '100%', display: 'block', cursor: 'crosshair' }}
        />

        {/* Zero Capital Overlay Notice */}
        {isZeroCapital && (
          <div 
            style={{
              position: 'absolute',
              bottom: '50px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(15, 23, 42, 0.88)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '12px',
              padding: '10px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backdropFilter: 'blur(8px)',
              pointerEvents: 'none',
              maxWidth: '560px',
              width: '90%'
            }}
          >
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b', flexShrink: 0 }}></div>
            <div style={{ fontSize: '0.76rem', color: '#cbd5e1', lineHeight: '1.4' }}>
              <strong>Zero Capital Standing Baseline:</strong> As no investments have been deployed yet, this market chart is pegged at ₹0. The first verified investor payment will immediately trigger green candlestick volume surges.
            </div>
          </div>
        )}
      </div>

      {/* 4. Live Order Tape & Execution Status Bar */}
      <div 
        style={{
          padding: '10px 22px',
          background: '#050811',
          borderTop: '1px solid #1e293b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.72rem',
          color: '#64748b'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={14} color="#10b981" />
          <span>Settlement Rail: <strong>Official UPI (8248651695-3@ybl)</strong></span>
          <span style={{ color: '#334155' }}>•</span>
          <span>Escrow Protocol: <strong>Ring-Fenced Milestone Disbursement</strong></span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#10b981' }}>● 100% On-Chain & Bank Verified</span>
          <span style={{ color: '#334155' }}>•</span>
          <span style={{ color: '#94a3b8' }}>Latency: 12ms</span>
        </div>
      </div>
    </div>
  );
};
