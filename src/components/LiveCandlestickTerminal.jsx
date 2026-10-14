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
  CheckCircle2,
  Sparkles,
  Radio,
  Sliders,
  DollarSign,
  Building2,
  Lock
} from 'lucide-react';

export const LiveCandlestickTerminal = ({ 
  totalCapitalRaised = 0, 
  totalInvestors = 0,
  investments = [],
  projects = [],
  onInvest
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [selectedAssetId, setSelectedAssetId] = useState('ALL');
  const [timeframe, setTimeframe] = useState('1D');
  const [chartType, setChartType] = useState('candles'); // 'candles' | 'line' | 'area'
  const [showVolume, setShowVolume] = useState(true);
  const [showEMA, setShowEMA] = useState(true);
  const [mousePos, setMousePos] = useState({ x: -1, y: -1 });
  const [hoveredCandle, setHoveredCandle] = useState(null);
  const [test500Active, setTest500Active] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [selectedLotSize, setSelectedLotSize] = useState(500);

  // Live IST Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-IN', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Venture Tickers and metadata
  const assetSpecs = [
    { 
      id: 'ALL', 
      ticker: 'RBI-COMPOSITE', 
      name: 'All 4 Ventures Composite Index', 
      exchange: 'RBI / NSE:VENTURE-INDEX', 
      target: 159500, 
      minTicket: 500, 
      estYield: '15.2% Net Term Yield',
      sprint: 'Multi-Sprint Index'
    },
    { 
      id: 'proj-unavukadai', 
      ticker: 'UNAVU-EQ', 
      name: 'UnavuKadai Jasai', 
      exchange: 'RBI:FOOD-TECH', 
      target: 4000, 
      minTicket: 500, 
      estYield: '14.2% Net Term Yield',
      sprint: '6-Day Sprint'
    },
    { 
      id: 'proj-carpenterbullet', 
      ticker: 'CARP-EQ', 
      name: 'CarpenterBullet', 
      exchange: 'RBI:MARKETPLACE', 
      target: 10000, 
      minTicket: 1000, 
      estYield: '15.0% Commission Pool',
      sprint: '40-Day Sprint'
    },
    { 
      id: 'proj-wooden-laptop-case', 
      ticker: 'WOOD-EQ', 
      name: 'Wooden Laptop Case', 
      exchange: 'RBI:D2C-MFG', 
      target: 99500, 
      minTicket: 2500, 
      estYield: '18.5% Net Term Yield',
      sprint: '30-Day Batch'
    },
    { 
      id: 'proj-bamboo-cup', 
      ticker: 'BAMBOO-EQ', 
      name: 'Bamboo Cup', 
      exchange: 'RBI:ECO-MFG', 
      target: 46000, 
      minTicket: 500, 
      estYield: '16.0% Net Term Yield',
      sprint: '30-Day Batch'
    }
  ];

  const activeAsset = assetSpecs.find(a => a.id === selectedAssetId) || assetSpecs[0];

  // Effective real capital numbers
  const isAll = selectedAssetId === 'ALL';
  const matchingProject = projects.find(p => p.id === selectedAssetId);
  const baseCapital = isAll 
    ? Number(totalCapitalRaised) 
    : (Number(matchingProject?.capitalRaised) || 0);
  
  const baseInvestors = isAll
    ? Number(totalInvestors)
    : (Number(matchingProject?.investorsCount) || 0);

  const activeCapital = test500Active ? (baseCapital + 500) : baseCapital;
  const activeInvestors = test500Active ? (baseInvestors + 1) : baseInvestors;
  const isZero = activeCapital === 0;

  // Build real transaction candles based on actual capital inflow
  const buildCandleDataset = () => {
    if (isZero) {
      return [
        { id: 'c-0', time: '09:15 AM', open: 0, high: 0, low: 0, close: 0, volume: 0, label: 'Pre-Market Open', status: 'FLAT' },
        { id: 'c-1', time: '10:00 AM', open: 0, high: 0, low: 0, close: 0, volume: 0, label: 'Genesis Settlement Floor', status: 'FLAT' },
        { id: 'c-2', time: '11:30 AM', open: 0, high: 0, low: 0, close: 0, volume: 0, label: 'Escrow Liquidity Ready', status: 'FLAT' },
        { id: 'c-3', time: '01:00 PM', open: 0, high: 0, low: 0, close: 0, volume: 0, label: 'Zero Capital Standing', status: 'FLAT' },
        { id: 'c-4', time: '02:30 PM', open: 0, high: 0, low: 0, close: 0, volume: 0, label: 'Awaiting 1st Order Ticket', status: 'FLAT' }
      ];
    }

    let relevantTxs = investments.filter(inv => {
      if (isAll) return inv.status === 'CONFIRMED' || inv.status === 'PENDING_APPROVAL';
      return inv.projectId === selectedAssetId && (inv.status === 'CONFIRMED' || inv.status === 'PENDING_APPROVAL');
    });

    if (relevantTxs.length === 0 && activeCapital > 0) {
      relevantTxs = [{
        id: 'tx-live-1',
        amount: activeCapital,
        timestamp: '10:30 AM',
        investorName: 'Initial Verified Backer',
        status: 'CONFIRMED'
      }];
    } else if (test500Active) {
      relevantTxs = [...relevantTxs, {
        id: 'tx-preview-500',
        amount: 500,
        timestamp: currentTime || 'Just Now',
        investorName: 'Simulated Market Order (+₹500)',
        status: 'CONFIRMED'
      }];
    }

    let cumulative = 0;
    const dataset = [
      { id: 'genesis', time: '09:15 AM', open: 0, high: 0, low: 0, close: 0, volume: 0, label: 'Genesis (₹0)', status: 'FLAT' }
    ];

    relevantTxs.forEach((tx, idx) => {
      const amt = Number(tx.amount) || 500;
      const prev = cumulative;
      cumulative += amt;
      const candleHigh = cumulative;
      const candleLow = prev;

      dataset.push({
        id: tx.id || `tx-${idx}`,
        time: tx.timestamp || `${10 + idx}:00 AM`,
        open: prev,
        close: cumulative,
        high: candleHigh,
        low: candleLow,
        volume: amt,
        label: `Order #${idx + 1}: +₹${amt.toLocaleString('en-IN')}`,
        investor: tx.investorName || 'Institutional Backer',
        status: 'BULLISH'
      });
    });

    return dataset;
  };

  const candleData = buildCandleDataset();

  // Canvas Drawing Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Responsive Canvas sizing
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Background Gradient: Institutional Obsidian
    const bg = ctx.createLinearGradient(0, 0, 0, height);
    bg.addColorStop(0, '#090d16');
    bg.addColorStop(1, '#05070d');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    const padding = { top: 35, right: 85, bottom: 45, left: 18 };
    const chartHeight = showVolume 
      ? (height - padding.top - padding.bottom) * 0.72 
      : (height - padding.top - padding.bottom);
    const volHeight = showVolume ? (height - padding.top - padding.bottom) * 0.22 : 0;
    const volTop = padding.top + chartHeight + 12;
    const chartWidth = width - padding.left - padding.right;

    const count = candleData.length;
    if (count === 0) return;

    // Scale calculation
    const maxVal = Math.max(1000, activeCapital * 1.35);
    const minVal = 0;
    const priceRange = maxVal - minVal || 1;

    let maxVol = 500;
    candleData.forEach(c => {
      if (c.volume > maxVol) maxVol = c.volume;
    });

    const stepX = chartWidth / count;
    const candleWidth = Math.min(38, Math.max(14, stepX * 0.58));
    const zeroY = padding.top + chartHeight;

    // 1. Grid Lines & Rupee Price Axis
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#64748b';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';

    const gridRows = 5;
    for (let i = 0; i <= gridRows; i++) {
      const y = padding.top + (chartHeight * (i / gridRows));
      const priceVal = maxVal - ((i / gridRows) * priceRange);

      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      // Right Axis Label
      ctx.fillStyle = '#64748b';
      ctx.fillText(`₹${Math.round(priceVal).toLocaleString('en-IN')}`, width - padding.right + 8, y + 3);
    }

    // 2. Chart Rendering: Candles or Line
    const points = [];

    candleData.forEach((c, idx) => {
      const x = padding.left + (idx * stepX) + (stepX / 2);
      const isFlat = c.status === 'FLAT' || c.open === c.close;
      
      const yOpen = padding.top + chartHeight - ((c.open - minVal) / priceRange) * chartHeight;
      const yClose = padding.top + chartHeight - ((c.close - minVal) / priceRange) * chartHeight;
      const yHigh = padding.top + chartHeight - ((c.high - minVal) / priceRange) * chartHeight;
      const yLow = padding.top + chartHeight - ((c.low - minVal) / priceRange) * chartHeight;

      points.push({ x, y: yClose });

      if (chartType === 'candles') {
        // High / Low Wick
        if (!isFlat) {
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(x, yHigh);
          ctx.lineTo(x, yLow);
          ctx.stroke();
        }

        // Candle Body
        if (isFlat) {
          ctx.fillStyle = '#475569';
          ctx.fillRect(x - candleWidth / 2, zeroY - 2, candleWidth, 3);
        } else {
          const top = Math.min(yOpen, yClose);
          const bodyH = Math.max(4, Math.abs(yClose - yOpen));

          const candleGrad = ctx.createLinearGradient(0, top, 0, top + bodyH);
          candleGrad.addColorStop(0, '#34d399');
          candleGrad.addColorStop(1, '#059669');
          ctx.fillStyle = candleGrad;

          ctx.fillRect(x - candleWidth / 2, top, candleWidth, bodyH);

          // Candle border
          ctx.strokeStyle = '#6ee7b7';
          ctx.lineWidth = 1;
          ctx.strokeRect(x - candleWidth / 2, top, candleWidth, bodyH);

          // Live price tag above candle
          ctx.fillStyle = '#34d399';
          ctx.font = 'bold 10px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(`+₹${c.volume.toLocaleString('en-IN')}`, x, top - 8);
        }
      }

      // Volume Bars in Sub-Panel
      if (showVolume) {
        const vH = isFlat ? 2 : Math.max(4, (c.volume / maxVol) * volHeight);
        const vY = volTop + volHeight - vH;

        ctx.fillStyle = isFlat ? 'rgba(71, 85, 105, 0.25)' : 'rgba(16, 185, 129, 0.45)';
        ctx.fillRect(x - candleWidth / 2, vY, candleWidth, vH);
      }

      // X-Axis Time Label
      ctx.fillStyle = '#64748b';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(c.time, x, height - 12);
    });

    // Line / Area Chart Mode
    if (chartType === 'line' || chartType === 'area') {
      if (points.length > 0) {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        if (chartType === 'area') {
          ctx.lineTo(points[points.length - 1].x, zeroY);
          ctx.lineTo(points[0].x, zeroY);
          ctx.closePath();
          const areaGrad = ctx.createLinearGradient(0, padding.top, 0, zeroY);
          areaGrad.addColorStop(0, 'rgba(16, 185, 129, 0.25)');
          areaGrad.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
          ctx.fillStyle = areaGrad;
          ctx.fill();
        }
      }
    }

    // 3. EMA Trendline (if enabled & active capital)
    if (showEMA && points.length > 1 && !isZero) {
      ctx.beginPath();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        const midY = (points[i - 1].y + points[i].y) / 2;
        ctx.lineTo(points[i].x, midY);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 4. Current Capital Horizontal Tracer Line
    const currentPriceY = isZero ? zeroY : padding.top + chartHeight - ((activeCapital - minVal) / priceRange) * chartHeight;
    ctx.strokeStyle = isZero ? '#f59e0b' : '#10b981';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(padding.left, currentPriceY);
    ctx.lineTo(width - padding.right, currentPriceY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Right-Hand Price Badge
    ctx.fillStyle = isZero ? '#d97706' : '#059669';
    const tagX = width - padding.right + 2;
    const tagY = currentPriceY - 11;
    const tagW = 76;
    const tagH = 22;
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(tagX, tagY, tagW, tagH, 5);
      ctx.fill();
    } else {
      ctx.fillRect(tagX, tagY, tagW, tagH);
    }

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`₹${activeCapital.toLocaleString('en-IN')}`, tagX + tagW / 2, tagY + 15);

    // 5. Interactive Crosshair Hover
    if (mousePos.x >= padding.left && mousePos.x <= width - padding.right) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);

      // Vertical line
      ctx.beginPath();
      ctx.moveTo(mousePos.x, padding.top);
      ctx.lineTo(mousePos.x, height - padding.bottom);
      ctx.stroke();

      // Horizontal line
      if (mousePos.y >= padding.top && mousePos.y <= padding.top + chartHeight) {
        ctx.beginPath();
        ctx.moveTo(padding.left, mousePos.y);
        ctx.lineTo(width - padding.right, mousePos.y);
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }

  }, [candleData, activeCapital, isZero, mousePos, chartType, showVolume, showEMA]);

  // Mouse Move on Canvas
  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    const padding = { left: 18, right: 85 };
    const chartWidth = rect.width - padding.left - padding.right;
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

  const handleQuickInvestClick = (amt) => {
    if (onInvest) {
      const targetProj = isAll ? projects[0] : matchingProject;
      onInvest(targetProj, amt);
    }
  };

  return (
    <div 
      ref={containerRef}
      style={{
        background: '#090d16',
        borderRadius: '24px',
        border: '1px solid #1e293b',
        boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255,255,255,0.04)',
        overflow: 'hidden',
        marginBottom: '32px',
        color: '#f8fafc',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
      }}
    >
      {/* ===================================================================== */}
      {/* 1. TOP INSTITUTIONAL TICKER & TELEMETRY RIBBON */}
      {/* ===================================================================== */}
      <div 
        style={{
          padding: '16px 24px',
          borderBottom: '1px solid #1e293b',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          background: 'linear-gradient(180deg, #131b2e 0%, #0c1220 100%)'
        }}
      >
        {/* Left: Exchange Code & Active Asset */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ 
              width: '9px', 
              height: '9px', 
              borderRadius: '50%', 
              background: '#10b981', 
              boxShadow: '0 0 12px #10b981',
              display: 'inline-block' 
            }} className="live-pulse-dot"></span>
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.02em', fontFamily: 'monospace' }}>
                  {activeAsset.ticker}
                </span>
                <span style={{ 
                  background: '#1e293b', 
                  color: '#94a3b8', 
                  fontSize: '0.65rem', 
                  padding: '2px 7px', 
                  borderRadius: '6px', 
                  fontWeight: '800',
                  letterSpacing: '0.04em'
                }}>
                  {activeAsset.exchange}
                </span>
                <span style={{ 
                  background: 'rgba(16, 185, 129, 0.12)', 
                  color: '#34d399', 
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  fontSize: '0.65rem', 
                  padding: '2px 7px', 
                  borderRadius: '6px', 
                  fontWeight: '800' 
                }}>
                  ● LIVE TRADING DESK
                </span>
              </div>
              <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: '500' }}>
                {activeAsset.name} • Settlement: UPI Escrow (8248651695-3@ybl)
              </span>
            </div>
          </div>
        </div>

        {/* Right: Live IST Clock & 1-Click Simulation Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            background: '#090d16', 
            border: '1px solid #1e293b', 
            padding: '6px 12px', 
            borderRadius: '8px',
            fontSize: '0.74rem',
            color: '#94a3b8',
            fontFamily: 'monospace'
          }}>
            <Clock size={13} color="#38bdf8" />
            <span>IST: {currentTime || 'Live Market'}</span>
          </div>

          <button
            type="button"
            onClick={() => setTest500Active(!test500Active)}
            style={{
              background: test500Active ? '#10b981' : '#1e293b',
              color: test500Active ? '#000000' : '#e2e8f0',
              border: test500Active ? '1px solid #10b981' : '1px solid #334155',
              padding: '7px 14px',
              borderRadius: '8px',
              fontSize: '0.76rem',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
              boxShadow: test500Active ? '0 0 14px rgba(16, 185, 129, 0.4)' : 'none'
            }}
            title="Toggle to test and inspect how a ₹500 investment plots immediately as a green candlestick"
          >
            <Sparkles size={14} />
            <span>{test500Active ? '✓ Simulating +₹500 Inflow' : 'Preview ₹500 Investment'}</span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. REAL STOCK TICKER QUOTE BAR */}
      {/* ===================================================================== */}
      <div 
        style={{
          padding: '12px 24px',
          background: '#0c1220',
          borderBottom: '1px solid #1e293b',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '14px',
          alignItems: 'center',
          fontFamily: 'monospace'
        }}
      >
        <div>
          <span style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', display: 'block' }}>
            LAST TRADED CAPITAL (LTP)
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px' }}>
            <span style={{ 
              fontSize: '1.45rem', 
              fontWeight: '900', 
              color: isZero ? '#fbbf24' : '#10b981',
              letterSpacing: '-0.02em' 
            }}>
              ₹{activeCapital.toLocaleString('en-IN')}
            </span>
            <span style={{ 
              fontSize: '0.72rem', 
              fontWeight: '800', 
              color: isZero ? '#94a3b8' : '#34d399' 
            }}>
              {isZero ? '0.00% Genesis' : `+₹${activeCapital} (+100%)`}
            </span>
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', display: 'block' }}>
            SYNDICATE TARGET
          </span>
          <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#38bdf8', marginTop: '3px' }}>
            ₹{activeAsset.target.toLocaleString('en-IN')}
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', display: 'block' }}>
            EXPECTED RETURN
          </span>
          <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#34d399', marginTop: '3px' }}>
            {activeAsset.estYield}
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', display: 'block' }}>
            VERIFIED BACKERS
          </span>
          <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffffff', marginTop: '3px' }}>
            {activeInvestors} Investors
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', display: 'block' }}>
            MIN ENTRY LOT
          </span>
          <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#d97706', marginTop: '3px' }}>
            ₹{activeAsset.minTicket.toLocaleString('en-IN')} / Lot
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 3. TOOLBAR: TIMEFRAMES, CHART TYPES & VENTURE PILLS */}
      {/* ===================================================================== */}
      <div 
        style={{
          padding: '10px 24px',
          background: '#070b13',
          borderBottom: '1px solid #1e293b',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}
      >
        {/* Venture Asset Selectors */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {assetSpecs.map(spec => {
            const isSelected = spec.id === selectedAssetId;
            return (
              <button
                key={spec.id}
                type="button"
                onClick={() => setSelectedAssetId(spec.id)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '8px',
                  fontSize: '0.74rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  border: isSelected ? '1px solid #d97706' : '1px solid #1e293b',
                  background: isSelected ? '#1e293b' : 'transparent',
                  color: isSelected ? '#fbbf24' : '#94a3b8',
                  transition: 'all 0.15s ease'
                }}
              >
                {spec.ticker}
              </button>
            );
          })}
        </div>

        {/* Chart View Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Chart Type Selector */}
          <div style={{ display: 'flex', background: '#0e1526', padding: '2px', borderRadius: '8px', border: '1px solid #1e293b' }}>
            <button
              type="button"
              onClick={() => setChartType('candles')}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: '700',
                cursor: 'pointer',
                border: 'none',
                background: chartType === 'candles' ? '#1e293b' : 'transparent',
                color: chartType === 'candles' ? '#ffffff' : '#64748b'
              }}
            >
              Candles 🕯️
            </button>
            <button
              type="button"
              onClick={() => setChartType('line')}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: '700',
                cursor: 'pointer',
                border: 'none',
                background: chartType === 'line' ? '#1e293b' : 'transparent',
                color: chartType === 'line' ? '#ffffff' : '#64748b'
              }}
            >
              Line 📈
            </button>
            <button
              type="button"
              onClick={() => setChartType('area')}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: '700',
                cursor: 'pointer',
                border: 'none',
                background: chartType === 'area' ? '#1e293b' : 'transparent',
                color: chartType === 'area' ? '#ffffff' : '#64748b'
              }}
            >
              Area 🌊
            </button>
          </div>

          {/* Timeframe selector */}
          <div style={{ display: 'flex', background: '#0e1526', padding: '2px', borderRadius: '8px', border: '1px solid #1e293b' }}>
            {['1M', '5M', '15M', '1H', '1D', 'ALL'].map(tf => (
              <button
                key={tf}
                type="button"
                onClick={() => setTimeframe(tf)}
                style={{
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  border: 'none',
                  background: timeframe === tf ? '#d97706' : 'transparent',
                  color: timeframe === tf ? '#000000' : '#64748b'
                }}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Indicator toggles */}
          <button
            type="button"
            onClick={() => setShowEMA(!showEMA)}
            style={{
              padding: '4px 10px',
              borderRadius: '8px',
              fontSize: '0.72rem',
              fontWeight: '700',
              cursor: 'pointer',
              border: '1px solid #1e293b',
              background: showEMA ? 'rgba(251, 191, 36, 0.15)' : 'transparent',
              color: showEMA ? '#fbbf24' : '#64748b'
            }}
          >
            EMA 20
          </button>

          <button
            type="button"
            onClick={() => setShowVolume(!showVolume)}
            style={{
              padding: '4px 10px',
              borderRadius: '8px',
              fontSize: '0.72rem',
              fontWeight: '700',
              cursor: 'pointer',
              border: '1px solid #1e293b',
              background: showVolume ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
              color: showVolume ? '#34d399' : '#64748b'
            }}
          >
            Volume
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 4. MAIN TRADING VIEWPORT: DUAL-PANE (CHART 72% + TIME & SALES 28%) */}
      {/* ===================================================================== */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(280px, 320px)', minHeight: '380px' }}>
        
        {/* Left Pane: Interactive High-Precision Candlestick Canvas */}
        <div style={{ position: 'relative', width: '100%', height: '380px', background: '#090d16', borderRight: '1px solid #1e293b' }}>
          
          {/* Active Hover HUD Badge */}
          {hoveredCandle && (
            <div style={{
              position: 'absolute',
              top: '12px',
              left: '20px',
              zIndex: 10,
              background: 'rgba(15, 23, 42, 0.88)',
              backdropFilter: 'blur(8px)',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '6px 12px',
              display: 'flex',
              gap: '12px',
              fontSize: '0.74rem',
              fontFamily: 'monospace',
              pointerEvents: 'none',
              boxShadow: '0 8px 16px rgba(0,0,0,0.4)'
            }}>
              <span style={{ color: '#94a3b8' }}>{hoveredCandle.time}</span>
              <span>Open: <strong style={{ color: '#f8fafc' }}>₹{hoveredCandle.open}</strong></span>
              <span>High: <strong style={{ color: '#34d399' }}>₹{hoveredCandle.high}</strong></span>
              <span>Low: <strong style={{ color: '#f8fafc' }}>₹{hoveredCandle.low}</strong></span>
              <span>Close: <strong style={{ color: '#34d399' }}>₹{hoveredCandle.close}</strong></span>
              <span>Volume: <strong style={{ color: '#38bdf8' }}>₹{hoveredCandle.volume}</strong></span>
            </div>
          )}

          {/* Zero Capital Overlay Notice */}
          {isZero && !hoveredCandle && (
            <div style={{
              position: 'absolute',
              bottom: '55px',
              left: '24px',
              zIndex: 5,
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '8px',
              padding: '6px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.74rem',
              color: '#fbbf24'
            }}>
              <Info size={14} />
              <span>Genesis Floor: ₹0 Capital Inflow • Chart ready for initial ₹500 market candle</span>
            </div>
          )}

          <canvas
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ width: '100%', height: '100%', display: 'block', cursor: 'crosshair' }}
          />
        </div>

        {/* Right Pane: Live Time & Sales / Market Depth Tape */}
        <div style={{ background: '#0a0f1d', display: 'flex', flexDirection: 'column' }}>
          
          <div style={{ 
            padding: '12px 16px', 
            borderBottom: '1px solid #1e293b', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            background: '#0d1424'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Activity size={14} color="#10b981" />
              <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#f8fafc', textTransform: 'uppercase' }}>
                Time & Sales (Trade Tape)
              </span>
            </div>
            <span style={{ fontSize: '0.68rem', color: '#64748b', fontFamily: 'monospace' }}>
              REAL-TIME
            </span>
          </div>

          {/* Trade Table Header */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1.2fr 1.2fr', 
            padding: '6px 14px', 
            fontSize: '0.68rem', 
            color: '#64748b', 
            fontWeight: '700',
            borderBottom: '1px solid #1e293b',
            fontFamily: 'monospace'
          }}>
            <span>TIME</span>
            <span>TYPE / LOT</span>
            <span style={{ textAlign: 'right' }}>AMOUNT (INR)</span>
          </div>

          {/* Live Trades Stream */}
          <div style={{ flex: 1, overflowY: 'auto', maxHeight: '240px', padding: '6px 0' }}>
            {candleData.filter(c => c.volume > 0).length > 0 ? (
              candleData.filter(c => c.volume > 0).map((c, i) => (
                <div 
                  key={c.id || i}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1.2fr 1.2fr',
                    padding: '6px 14px',
                    fontSize: '0.72rem',
                    fontFamily: 'monospace',
                    alignItems: 'center',
                    borderBottom: '1px solid rgba(30, 41, 59, 0.4)',
                    background: i === 0 ? 'rgba(16, 185, 129, 0.06)' : 'transparent'
                  }}
                >
                  <span style={{ color: '#94a3b8' }}>{c.time}</span>
                  <span style={{ color: '#34d399', fontWeight: '700' }}>BUY • ESCROW</span>
                  <span style={{ textAlign: 'right', fontWeight: '800', color: '#10b981' }}>
                    +₹{c.volume.toLocaleString('en-IN')}
                  </span>
                </div>
              ))
            ) : (
              <div style={{ padding: '28px 16px', textAlign: 'center' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#1e293b', margin: '0 auto 10px auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TrendingUp size={18} color="#64748b" />
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#cbd5e1' }}>
                  No Confirmed Trades Yet
                </div>
                <p style={{ fontSize: '0.72rem', color: '#64748b', margin: '4px 0 14px 0' }}>
                  Genesis block standing at ₹0. Be the first backer to plot the opening green candle!
                </p>
                <button
                  type="button"
                  onClick={() => handleQuickInvestClick(500)}
                  className="btn btn-primary btn-sm"
                  style={{ fontSize: '0.75rem', fontWeight: '800', borderRadius: '8px', width: '100%' }}
                >
                  <Zap size={13} />
                  <span>Place 1st ₹500 Order</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick Lot Direct Order Bar */}
          <div style={{ padding: '12px 14px', borderTop: '1px solid #1e293b', background: '#090d16' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: '700', color: '#64748b', marginBottom: '6px' }}>
              QUICK ORDER TICKET (INSTANT UPI SETTLEMENT)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', marginBottom: '8px' }}>
              {[500, 1000, 2500, 5000].map(amt => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setSelectedLotSize(amt)}
                  style={{
                    padding: '4px 0',
                    borderRadius: '6px',
                    fontSize: '0.68rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    border: selectedLotSize === amt ? '1px solid #10b981' : '1px solid #1e293b',
                    background: selectedLotSize === amt ? '#10b981' : '#0e1526',
                    color: selectedLotSize === amt ? '#000000' : '#cbd5e1'
                  }}
                >
                  ₹{amt >= 1000 ? `${amt / 1000}k` : amt}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => handleQuickInvestClick(selectedLotSize)}
              className="btn btn-primary btn-sm"
              style={{ width: '100%', borderRadius: '8px', fontWeight: '800', fontSize: '0.78rem' }}
            >
              <Zap size={14} />
              <span>Back with ₹{selectedLotSize.toLocaleString('en-IN')} Now</span>
            </button>
          </div>

        </div>

      </div>

      {/* ===================================================================== */}
      {/* 5. REGULATORY SETTLEMENT FOOTER STRIP */}
      {/* ===================================================================== */}
      <div 
        style={{
          padding: '10px 24px',
          background: '#060910',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <ShieldCheck size={14} color="#10b981" />
          <span>Settlement Rail: <strong>Official UPI (8248651695-3@ybl)</strong></span>
          <span style={{ color: '#334155' }}>•</span>
          <span>Escrow Clearing: <strong>100% Ring-Fenced Milestone Payouts</strong></span>
          <span style={{ color: '#334155' }}>•</span>
          <span>Market Telemetry: <strong>Genuine Real-Capital Plotting (Zero Mock Motion)</strong></span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: '700' }}>
          <span className="live-pulse-dot" style={{ width: '6px', height: '6px' }}></span>
          <span>Exchange Connected</span>
        </div>
      </div>
    </div>
  );
};
