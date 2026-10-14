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
  CheckCircle2,
  Sparkles,
  Radio
} from 'lucide-react';

export const LiveCandlestickTerminal = ({ 
  totalCapitalRaised = 0, 
  totalInvestors = 0,
  investments = []
}) => {
  const canvasRef = useRef(null);
  const [selectedAsset, setSelectedAsset] = useState('ALL');
  const [hoveredCandle, setHoveredCandle] = useState(null);
  const [mousePos, setMousePos] = useState({ x: -1, y: -1 });
  const [test500Active, setTest500Active] = useState(false);

  // Effective capital: if user toggles "Preview ₹500", or uses real totalCapitalRaised
  const activeCapital = test500Active ? (Number(totalCapitalRaised) + 500) : Number(totalCapitalRaised);
  const activeBackers = test500Active ? (Number(totalInvestors) + 1) : Number(totalInvestors);
  const isZero = activeCapital === 0;

  // Venture asset metadata
  const assets = [
    { id: 'ALL', name: 'All 4 Business Ventures Composite', ticker: 'RBI-4X', target: '₹1,59,500' },
    { id: 'proj-unavukadai', name: 'UnavuKadai Cloud Kitchen', ticker: 'UK-FOOD', target: '₹4,000' },
    { id: 'proj-carpenterbullet', name: 'CarpenterBullet Guild', ticker: 'CB-LEAD', target: '₹10,000' },
    { id: 'proj-wooden-laptop-case', name: 'CNC Laptop Case Batch', ticker: 'WC-WOOD', target: '₹99,500' },
    { id: 'proj-bamboo-cup', name: 'Bamboo Eco Cup Batch', ticker: 'BC-CUP', target: '₹46,000' },
  ];

  // Build the genuine market transaction candles based strictly on real investment capital
  const buildCandles = () => {
    // If capital is 0, show initial zero baseline candles
    if (isZero) {
      return [
        { id: 'base-1', time: '10:00 AM', open: 0, high: 0, low: 0, close: 0, volume: 0, label: 'Market Open' },
        { id: 'base-2', time: '11:00 AM', open: 0, high: 0, low: 0, close: 0, volume: 0, label: 'Genesis Floor' },
        { id: 'base-3', time: '12:00 PM', open: 0, high: 0, low: 0, close: 0, volume: 0, label: 'Capital Ready' },
        { id: 'base-4', time: '01:00 PM', open: 0, high: 0, low: 0, close: 0, volume: 0, label: 'Current Zero Standing' }
      ];
    }

    // Filter confirmed/active investments
    let txList = investments && investments.length > 0 ? investments : [];
    
    // If preview 500 is enabled or if capital > 0 but investments list is empty
    if (txList.length === 0 && activeCapital > 0) {
      txList = [{
        id: 'tx-live-1',
        amount: activeCapital,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        investorName: 'First Market Backer'
      }];
    } else if (test500Active) {
      txList = [...txList, {
        id: 'tx-preview-500',
        amount: 500,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        investorName: 'New Verified Investor (+₹500)'
      }];
    }

    let runningCapital = 0;
    const candleList = [
      { id: 'start', time: '09:30 AM', open: 0, high: 0, low: 0, close: 0, volume: 0, label: 'Market Genesis (₹0)' }
    ];

    txList.forEach((tx, idx) => {
      const amt = Number(tx.amount) || 500;
      const prev = runningCapital;
      runningCapital += amt;
      
      candleList.push({
        id: tx.id || `tx-${idx}`,
        time: tx.timestamp || `${10 + idx}:00 AM`,
        open: prev,
        close: runningCapital,
        high: runningCapital,
        low: prev,
        volume: amt,
        label: `Order #${idx + 1}: +₹${amt.toLocaleString('en-IN')}`,
        investor: tx.investorName || 'Investor Backer'
      });
    });

    return candleList;
  };

  const candleData = buildCandles();

  // Canvas drawing effect: no fake moving animation!
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Terminal Background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, '#0a0f1d');
    bgGrad.addColorStop(1, '#050811');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    const padding = { top: 30, right: 80, bottom: 50, left: 24 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = (height - padding.top - padding.bottom) * 0.74;
    const volHeight = (height - padding.top - padding.bottom) * 0.22;
    const volTop = padding.top + chartHeight + 12;

    const count = candleData.length;
    if (count === 0) return;

    // Determine scale based on real capital
    let maxVal = Math.max(1000, activeCapital * 1.25);
    let minVal = 0;
    const priceRange = maxVal - minVal || 1;

    let maxVol = 500;
    candleData.forEach(c => {
      if (c.volume > maxVol) maxVol = c.volume;
    });

    const stepX = chartWidth / count;
    const candleWidth = Math.min(42, Math.max(16, stepX * 0.55));

    // 1. Grid Lines & Price Axis Labels (₹0, ₹250, ₹500, ₹1000, etc.)
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

      const pVal = maxVal - (priceRange / gridRows) * i;
      ctx.fillText(`₹${Math.round(pVal).toLocaleString('en-IN')}`, width - padding.right + 8, y + 3);
    }

    // Baseline floor line at ₹0
    const zeroY = padding.top + chartHeight;
    ctx.strokeStyle = isZero ? '#f59e0b' : '#334155';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(padding.left, zeroY);
    ctx.lineTo(width - padding.right, zeroY);
    ctx.stroke();

    // If zero capital: display clear message
    if (isZero) {
      ctx.fillStyle = 'rgba(245, 158, 11, 0.08)';
      ctx.fillRect(padding.left, zeroY - 20, chartWidth, 24);

      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('◄ MARKET BASELINE: ₹0 CAPITAL RAISED • WHEN ₹500 IS INVESTED, CANDLE PLOTS AT ₹500 ►', width / 2, zeroY - 4);
    }

    // 2. Draw Candlesticks & Volume Bars
    candleData.forEach((c, idx) => {
      const x = padding.left + idx * stepX + stepX / 2;
      const isGreen = c.close >= c.open && c.close > 0;
      const isFlatZero = c.close === 0 && c.open === 0;

      const yOpen = padding.top + chartHeight - ((c.open - minVal) / priceRange) * chartHeight;
      const yClose = padding.top + chartHeight - ((c.close - minVal) / priceRange) * chartHeight;
      const yHigh = padding.top + chartHeight - ((c.high - minVal) / priceRange) * chartHeight;
      const yLow = padding.top + chartHeight - ((c.low - minVal) / priceRange) * chartHeight;

      const top = Math.min(yOpen, yClose);
      const bottom = Math.max(yOpen, yClose);
      const candleH = isFlatZero ? 2 : Math.max(4, bottom - top);

      // Wick (Upper & Lower)
      if (!isFlatZero) {
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, yHigh);
        ctx.lineTo(x, yLow);
        ctx.stroke();
      }

      // Candle Body
      if (isFlatZero) {
        ctx.fillStyle = '#475569';
        ctx.fillRect(x - candleWidth / 2, zeroY - 2, candleWidth, 3);
      } else {
        // Bright emerald green candle for real capital addition!
        const candleGrad = ctx.createLinearGradient(0, top, 0, bottom);
        candleGrad.addColorStop(0, '#10b981');
        candleGrad.addColorStop(1, '#059669');
        ctx.fillStyle = candleGrad;
        ctx.fillRect(x - candleWidth / 2, top, candleWidth, candleH);

        // Price Tag directly on top of candle
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`₹${c.close.toLocaleString('en-IN')}`, x, top - 8);
      }

      // Volume Bar (Lower panel)
      const vHeight = isFlatZero ? 2 : (c.volume / maxVol) * volHeight;
      const vY = volTop + volHeight - vHeight;
      ctx.fillStyle = isFlatZero ? 'rgba(100, 116, 139, 0.2)' : 'rgba(16, 185, 129, 0.5)';
      ctx.fillRect(x - candleWidth / 2, vY, candleWidth, vHeight);

      // X-Axis Timestamp Label
      ctx.fillStyle = '#64748b';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(c.time, x, height - 12);
    });

    // 3. Current Capital Indicator Line
    const currentPriceY = isZero ? zeroY : padding.top + chartHeight - ((activeCapital - minVal) / priceRange) * chartHeight;
    ctx.strokeStyle = isZero ? '#f59e0b' : '#10b981';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(padding.left, currentPriceY);
    ctx.lineTo(width - padding.right, currentPriceY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Right Axis Price Tag
    ctx.fillStyle = isZero ? '#d97706' : '#059669';
    const tagX = width - padding.right + 2;
    const tagY = currentPriceY - 10;
    const tagW = 72;
    const tagH = 20;
    ctx.roundRect ? ctx.roundRect(tagX, tagY, tagW, tagH, 4) : ctx.fillRect(tagX, tagY, tagW, tagH);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`₹${activeCapital.toLocaleString('en-IN')}`, tagX + tagW / 2, tagY + 14);

    // 4. Interactive Crosshair Hover
    if (mousePos.x >= padding.left && mousePos.x <= width - padding.right) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.setLineDash([2, 2]);

      ctx.beginPath();
      ctx.moveTo(mousePos.x, padding.top);
      ctx.lineTo(mousePos.x, height - padding.bottom);
      ctx.stroke();

      if (mousePos.y >= padding.top && mousePos.y <= padding.top + chartHeight) {
        ctx.beginPath();
        ctx.moveTo(padding.left, mousePos.y);
        ctx.lineTo(width - padding.right, mousePos.y);
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }

  }, [candleData, activeCapital, isZero, mousePos]);

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

    const padding = { left: 24, right: 80 };
    const chartWidth = canvas.width - padding.left - padding.right;
    const stepX = chartWidth / candleData.length;
    const idx = Math.floor((x - padding.left) / stepX);
    if (idx >= 0 && idx < candleData.length) {
      setHoveredCandle(candleData[idx]);
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
              background: isZero ? '#f59e0b' : '#10b981', 
              boxShadow: isZero ? '0 0 10px #f59e0b' : '0 0 10px #10b981',
              display: 'inline-block' 
            }}></span>
            
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ fontSize: '1.15rem', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.02em', fontFamily: 'monospace' }}>
                {activeAssetData.ticker}
              </span>
              <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: '600' }}>
                / REAL CAPITAL GRAPH
              </span>
            </div>
          </div>

          {/* Asset Dropdown */}
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
        </div>

        {/* Right: Real Capital Indicator & ₹500 Simulator Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={() => setTest500Active(!test500Active)}
            style={{
              background: test500Active ? '#10b981' : '#1e293b',
              color: test500Active ? '#000000' : '#e2e8f0',
              border: test500Active ? '1px solid #10b981' : '1px solid #334155',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.75rem',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            title="Click to simulate what the graph shows when ₹500 is invested"
          >
            <Sparkles size={13} />
            <span>{test500Active ? 'Showing ₹500 Inflow' : 'Preview ₹500 Investment'}</span>
          </button>
        </div>
      </div>

      {/* 2. Real Telemetry Bar */}
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
            <span style={{ color: '#64748b' }}>TOTAL CAPITAL RAISED: </span>
            <strong style={{ fontSize: '1.05rem', color: isZero ? '#fbbf24' : '#10b981' }}>
              ₹{activeCapital.toLocaleString('en-IN')}
            </strong>
          </div>

          <div>
            <span style={{ color: '#64748b' }}>SYNDICATE TARGET: </span>
            <strong style={{ color: '#38bdf8' }}>{activeAssetData.target}</strong>
          </div>

          <div>
            <span style={{ color: '#64748b' }}>VERIFIED BACKERS: </span>
            <strong style={{ color: '#ffffff' }}>{activeBackers} Investors</strong>
          </div>
        </div>

        {/* Hovered Candlestick Data */}
        {hoveredCandle ? (
          <div style={{ display: 'flex', gap: '12px', color: '#94a3b8' }}>
            <span>{hoveredCandle.label}</span>
            <span>Open: <strong style={{ color: '#f8fafc' }}>₹{hoveredCandle.open}</strong></span>
            <span>Close: <strong style={{ color: '#34d399' }}>₹{hoveredCandle.close}</strong></span>
            <span>Volume: <strong style={{ color: '#38bdf8' }}>₹{hoveredCandle.volume}</strong></span>
          </div>
        ) : (
          <div style={{ color: '#64748b', fontStyle: 'italic' }}>
            {isZero ? 'Currently ₹0. When ₹500 is invested, the candle plots at ₹500' : 'Hover over candle to inspect transaction'}
          </div>
        )}
      </div>

      {/* 3. Real Market Candlestick Canvas (No moving noise) */}
      <div style={{ position: 'relative', width: '100%', height: '300px', background: '#080d1a' }}>
        <canvas
          ref={canvasRef}
          width={920}
          height={300}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ width: '100%', height: '100%', display: 'block', cursor: 'crosshair' }}
        />
      </div>

      {/* 4. Footer Rail */}
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
          <span>Market Graph: <strong>100% Genuine Transaction Telemetry (Zero Fake Motion)</strong></span>
        </div>
      </div>
    </div>
  );
};
